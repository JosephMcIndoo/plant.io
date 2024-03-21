import type { Request, Response } from "express";


const variableList = ["time", "temperature", "humidity", "light", "moisture"];

export async function variables(req: Request, res: Response) {
    return res.send(variableList);
}



export async function data(req: Request, res: Response) {
    return res.send(JSON.stringify(variableList));
}



// Below you will see additionally implemented code according to the tasks that have been given. They may or may not be similar.
// interface Data {
//     topic: string;
//     message: string;
//   }

type Data = Record<typeof variableList[number], number[]>;
// Hard-coded data
const example: Data = {
  time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  temperature: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  humidity: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
  light: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
  moisture: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
  
  // {
  //   topic: 'plantio',
  //   message: '75.3%'
  // },
};

export const getTestData = (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(JSON.stringify(example));
};

export const getVariableNames = (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(JSON.stringify(variableList));
};

export const postString = (req: Request, res: Response) => {
  const inputString: string = req.body.input;
  console.log(`Received string: ${inputString}`);
  // Here you can add the code to send the string to the embedded device
  res.status(200).send({ status: 'success', message: 'String received' });
};