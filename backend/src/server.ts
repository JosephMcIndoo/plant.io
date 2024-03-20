import express from "express";
import { LogsRouter } from "./api/routes/logs";
import { LevelsRouter } from "./api/routes/levels";

const server = express();

server.use(express.json());
server.use("/logs", LogsRouter);
server.use("/levels", LevelsRouter);

export { server };
