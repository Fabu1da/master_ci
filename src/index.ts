import "reflect-metadata";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { InversifyExpressServer } from "inversify-express-utils";
import helmet from "helmet";
import cors from "cors";
import { Producer } from "kafkajs";

import {getConfig} from "./typeormconfig";
import { TYPES } from "./lib/types";
import { diContainer } from "../inversify.config";



(async ()=> {

    const app = new InversifyExpressServer(diContainer, null, {
        rootPath: "/api"
        });

    const dataSource = await getConfig();

    await dataSource.initialize();

    diContainer.bind(TYPES.DB).toConstantValue(dataSource);

    // Get the producer from the container for connection and shutdown handling
    const producer = diContainer.get<Producer>(TYPES.KafkaProducer);
    await producer.connect();

    app.setConfig((app) => {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(helmet());
        app.use(cors());
    });
    const server = app.build();

    const PORT = process.env.PORT || 3000;

    const httpServer = server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    const shutdown = async (signal: string) => {
        console.log(`${signal} received, shutting down...`);
        httpServer.close();
        await producer.disconnect();
        await dataSource.destroy();
        process.exit(0);
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
})().catch((error) => {
    console.error("Error starting the application:", error);
    process.exit(1);
});