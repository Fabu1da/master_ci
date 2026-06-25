
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import {  type EachMessagePayload,  } from "kafkajs";
import { MoreThan } from "typeorm";
import { getConfig } from "../typeormconfig";
import { Notification, User } from "../entities";

import { kafkaConsumer } from "./kafka.consumer";
import { kafkaProducer } from "./kafka.producer";
import { PostCreatedEvent } from "../types/consumer";


const SOURCE_TOPIC = process.env.SOURCE_TOPIC || "post.created";
const BROADCAST_TOPIC = process.env.BROADCAST_TOPIC || "notification-broadcast";
const DLQ_TOPIC = process.env.DLQ_TOPIC || "post.created.dlq";

const FANOUT_BATCH = Number(process.env.FANOUT_BATCH || 10_000);

const consumer = kafkaConsumer("notification-consumer");

const producer = kafkaProducer("notification-consumer");


function parseAndValidate(raw: string): PostCreatedEvent {
  const e = JSON.parse(raw); // throws on malformed JSON -> caught -> DLQ
  if (e == null || e.id == null || e.createdBy == null || typeof e.title !== "string") {
    throw new Error("post.created event missing required fields (id, title, createdBy)");
  }
  return e as PostCreatedEvent;
}


let userRepo: ReturnType<Awaited<ReturnType<typeof getConfig>>["getRepository"]>;
let notificationRepo: ReturnType<Awaited<ReturnType<typeof getConfig>>["getRepository"]>;

async function fanOutPerUser(
  event: PostCreatedEvent,
  heartbeat: () => Promise<void>,
): Promise<number> {
  let lastId: string | number | null = null;
  let total = 0;

  for (;;) {
    const page = await userRepo.find({
      where: lastId === null ? {} : { id: MoreThan(lastId) },
      order: { id: "ASC" },
      take: FANOUT_BATCH,
      select: { id: true },
    });
    if (page.length === 0) break;

    const rows = [];
    for (const u of page) {
      if (u.id === event.createdBy) continue; // skip the author
      rows.push({
        userId: u.id,
        postId: event.id,
        message: `New post: ${event.title}`,
      });
    }

    if (rows.length > 0) {
      await notificationRepo
        .createQueryBuilder()
        .insert()
        .values(rows)
        .orIgnore()
        .execute();
      total += rows.length;
    }

    lastId = page[page.length - 1].id;
    await heartbeat();
  }

  return total;
}

async function publishLiveBroadcast(event: PostCreatedEvent): Promise<void> {
  await producer.send({
    topic: BROADCAST_TOPIC,
    messages: [
      {
        key: String(event.id),
        value: JSON.stringify({
          id: `post-${event.id}`,
          target: { type: "broadcast", except: event.createdBy },
          payload: {
            kind: "NEW_POST",
            postId: event.id,
            title: event.title,
            createdBy: event.createdBy,
            createdAt: event.createdAt ?? new Date().toISOString(),
          },
        }),
      },
    ],
  });
}
async function sendToDlq(message: EachMessagePayload["message"], err: unknown): Promise<void> {
  await producer.send({
    topic: DLQ_TOPIC,
    messages: [
      {
        key: message.key ?? undefined,
        value: message.value ?? "",
        headers: {
          error: String(err instanceof Error ? err.message : err),
          failedAt: new Date().toISOString(),
          sourceTopic: SOURCE_TOPIC,
        },
      },
    ],
  });
}
async function main() {
  const dataSource = await getConfig();
  await dataSource.initialize();
  userRepo = dataSource.getRepository(User);
  notificationRepo = dataSource.getRepository(Notification);

  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: SOURCE_TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message, heartbeat }: EachMessagePayload) => {
      if (!message.value) return;

      let event: PostCreatedEvent;
      try {
        event = parseAndValidate(message.value.toString());
      } catch (err) {
        console.error("Routing message to DLQ:", err);
        await sendToDlq(message, err);
        return;
      }
      const count = await fanOutPerUser(event, heartbeat);
      await publishLiveBroadcast(event);

      console.log(`post ${event.id}: persisted ${count} notifications, broadcast queued`);
    },
  });

  console.log("notification-consumer running");

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received, shutting down...`);
    try {
      await consumer.disconnect();
      await producer.disconnect();
      await dataSource.destroy();
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("notification-consumer fatal:", err);
  process.exit(1);
});