import type { Request, Response } from "express";

export async function helloWorld(req: Request, res: Response) {
  return res.send("Hello");
}
