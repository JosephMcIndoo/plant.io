import express from "express";
import {
  CreateLog,
  GetAllLogs,
  GetLogByID,
} from "../controllers/logs.controller";

const router = express();

router.get("/", GetAllLogs);
router.get("/:id", GetLogByID);
router.post("/", CreateLog);

export { router as LogsRouter };
