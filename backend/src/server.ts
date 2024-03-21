import express from "express";
import { LogsRouter } from "./api/routes/logs";
import { LevelsRouter } from "./api/routes/levels";
import { AppRouter } from "./api/routes/app";

const server = express();

server.use(express.json());
server.use("/logs", LogsRouter);
server.use("/levels", LevelsRouter);
server.use("/", AppRouter);

export { server };
