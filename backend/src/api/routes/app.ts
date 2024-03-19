import express from "express";
import { variables, data } from "../controllers/app.controller";

const router = express();

router.get("/variables", variables);
router.get("/data", data);



export { router as AppRouter };
