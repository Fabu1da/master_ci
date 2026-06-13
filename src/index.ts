import "reflect-metadata";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { InversifyExpressServer } from "inversify-express-utils";
import helmet from "helmet";
import cors from "cors";
import { diContainer } from "../inversify.config";

import {getConfig} from "./typeormconfig";
import { TYPES } from "./lib/types";


(async ()=> {

const app = new InversifyExpressServer(diContainer, null, {
    rootPath: "/api"
    });

const dataSource = await getConfig();

await dataSource.initialize();

diContainer.bind(TYPES.DB).toConstantValue(dataSource);



app.setConfig((app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(cors());
});
const server = app.build();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
})();