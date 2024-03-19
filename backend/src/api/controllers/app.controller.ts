import type { Request, Response } from "express";


const variableList = ["time", "temperature", "humidity", "light", "moisture"];

export async function variables(req: Request, res: Response) {
    return res.send(variableList);
}



export async function data(req: Request, res: Response) {
    return res.send(JSON.stringify(variableList));
}



// Below you will see additionally implemented code according to the tasks that have been given. They may or may not be similar.
interface Data {
    topic: string;
    message: string;
  }
  
  // Hard-coded data
  const example: Data[] = [
    {
      topic: 'plantio',
      message: '75.3%'
    },
  ];
  
  export const getTestData = (req: Request, res: Response) => {
    res.json(example);
  };
  
  export const getVariableNames = (req: Request, res: Response) => {
    res.json(variableList);
  };
  
  export const postString = (req: Request, res: Response) => {
    const inputString: string = req.body.input;
    console.log(`Received string: ${inputString}`);
    // Here you can add the code to send the string to the embedded device
    res.status(200).send({ status: 'success', message: 'String received' });
  };