import express from "express";
import { AddLevels, GetLevelsByID } from "@/api/controllers/levels";

const router = express();

// router.get("/:id", GetLevelsByID);
// router.post("/", AddLevels);

export { router as LevelsRouter };
