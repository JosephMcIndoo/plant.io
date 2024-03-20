import type { Request, Response } from "express";
import { db } from "@/db";

export async function GetLevelsByID(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    console.log("[levels controller]: no id provided");
    return res.sendStatus(400);
  }

  db.get("SELECT * FROM levels WHERE id = ?;", [id], (err, row) => {
    if (err) {
      console.log("[levels controller]: error retrieving row");
      return res.sendStatus(500);
    }

    if (row) {
      return res.send(row);
    }

    return res.sendStatus(404);
  });
}

export async function AddLevels(req: Request, res: Response) {
  const lightLevel = req.body["light_level"] ?? undefined;
  const moistureLevel = req.body["moisture_level"] ?? undefined;

  if (!lightLevel && !moistureLevel) {
    console.log("[levels controller]: no levels in body");
    return res.sendStatus(400);
  }

  //There's probably a better way to do this but idrgaf
  if (lightLevel && !moistureLevel) {
    db.run(
      "INSERT INTO levels (created_at, light_level) VALUES (?, ?);",
      [new Date().toISOString(), lightLevel],
      (err) => {
        if (err) {
          console.log(
            `[levels controller]: failed to insert row ${err.message}`
          );
          return res.sendStatus(500);
        }

        return res.sendStatus(200);
      }
    );
  } else if (!lightLevel && moistureLevel) {
    db.run(
      "INSERT INTO levels (created_at, moisture_level) VALUES (?, ?);",
      [new Date().toISOString(), moistureLevel],
      (err) => {
        if (err) {
          console.log(
            `[levels controller]: failed to insert row ${err.message}`
          );
          return res.sendStatus(500);
        }

        return res.sendStatus(200);
      }
    );
  } else {
    db.run(
      "INSERT INTO levels (created_at, moisture_level, light_level) VALUES (?, ?, ?);",
      [new Date().toISOString(), moistureLevel, lightLevel],
      (err) => {
        if (err) {
          console.log(
            `[levels controller]: failed to insert row ${err.message}`
          );
          return res.sendStatus(500);
        }

        return res.sendStatus(200);
      }
    );
  }
}
