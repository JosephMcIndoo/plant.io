import express from "express";
import { TestRouter } from "./api/routes/test";

const server = express();

server.use("/", TestRouter);

export { server };
