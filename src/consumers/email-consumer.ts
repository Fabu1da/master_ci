// email-consumer.ts
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

import { kafkaConsumer } from "./kafka.consumer";


const consumer = kafkaConsumer("email-consumer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true",   // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

(async () => {
    console.log("Starting email-consumer...");
    console.log("user:", JSON.stringify(process.env.SMTP_USER));
    console.log("pass length:", process.env.SMTP_PASS?.length);
    // fail fast if SMTP is misconfigured, before consuming anything
    await transporter.verify();

    await consumer.connect();
    await consumer.subscribe({ topic: "post.created", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString());
            // event = { id, title, createdBy, createdAt }

            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: process.env.ADMIN_EMAIL,
                subject: "New post created",
                text: `"${event.title}" was created by user ${event.createdBy}.`,
            });

            console.log(`Emailed admin about post ${event.id}`);
        },
    });

    console.log("email-consumer running");

    const shutdown = async () => {
        await consumer.disconnect();
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
})().catch((err) => {
    console.error("email-consumer fatal:", err);
    process.exit(1);
});