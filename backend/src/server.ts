import express from "express";
import { TestRouter } from "./api/routes/test";
import mqtt from "mqtt";

//REST API
const server = express();

server.use("/", TestRouter);

export { server };
