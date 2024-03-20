import express from "express";
import { LogsRouter } from "./api/routes/logs";

const server = express();

server.use(express.json());
server.use("/logs", LogsRouter);

export { server };
