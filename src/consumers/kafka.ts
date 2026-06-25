import { Kafka, logLevel } from "kafkajs";

export const kafkaConfig = (clientId: string) => {

    const kafka = new Kafka({
        clientId,
        brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
        logLevel: logLevel.INFO,
    });

    return kafka;
}