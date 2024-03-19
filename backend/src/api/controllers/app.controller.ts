import type { Request, Response } from "express";


const variableList = ["time", "temperature", "humidity", "light", "moisture"];

export async function variables(req: Request, res: Response) {
    return res.send(variableList);
}



export async function data(req: Request, res: Response) {
    return res.send(JSON.stringify(variableList));
}
