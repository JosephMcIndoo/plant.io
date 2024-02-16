import express from "express";
import { helloWorld } from "../controllers/test.controller";

const router = express();

router.get("/", helloWorld);

export { router as TestRouter };
