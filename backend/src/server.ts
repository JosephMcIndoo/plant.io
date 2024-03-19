import express from "express";
import { TestRouter } from "./api/routes/test";
import { AppRouter } from "./api/routes/app";

const server = express();

server.use(express.json());
server.use("/", AppRouter);

export { server };
