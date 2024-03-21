import type { Request, Response } from "express";
import { db } from "@/db";

export async function GetAllLogs(req: Request, res: Response) {
  db.all("SELECT * FROM logs", (err, rows) => {
    if (err) {
      console.log("[logs controller]: error retrieving all rows");
      return res.sendStatus(500);
    }

    return res.send(rows);
  });
}

export async function GetLogByID(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    console.log("[logs controller]: no id provided");
    return res.sendStatus(400);
  }

  db.get("SELECT * FROM logs WHERE id = ?;", [id], (err, row) => {
    if (err) {
      console.log("[logs controller]: error retrieving row");
      return res.sendStatus(500);
    }

    if (row) {
      return res.send(row);
    }

    return res.sendStatus(404);
  });
}

export async function CreateLog(req: Request, res: Response) {
  const message = req.body["message"] ?? undefined;

  if (!message) {
    return res.status(400).send("Message empty");
  }

  db.run(
    `INSERT INTO logs (created_at, message) VALUES(?, ?);`,
    [new Date().toISOString(), message ?? ""],
    (err) => {
      if (err) {
        console.log(`[logs controller]: ${err.message}`);
        return res.status(500).send("Failed to insert value");
      }

      return res.sendStatus(200);
    }
  );
}
