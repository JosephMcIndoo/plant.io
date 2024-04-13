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
let example: Data = {
  time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  temperature: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 28],
  humidity: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 64],
  light: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 35],
  moisture: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 82],

  // {
  //   topic: 'plantio',
  //   message: '75.3%'
  // },
};

function updateData() {
  example["time"].push(example["time"][example["time"].length - 1] + 1);
  let temp = example["temperature"][example["temperature"].length - 1] + Math.random() * 10 - 5;
  if (temp > 100) {
    temp = 100
  } else if (temp < 0) {
    temp = 0
  }
  example["temperature"].push(temp);
  let humidity = example["humidity"][example["humidity"].length - 1] + Math.random() * 10 - 5;
  if (humidity > 100) {
    humidity = 100
  } else if (humidity < 0) {
    humidity = 0
  }
  example["humidity"].push(humidity);
  let light = example["light"][example["light"].length - 1] + Math.random() * 10 - 5;
  if (light > 100) {
    light = 100
  } else if (light < 0) {
    light = 0
  }
  example["light"].push(light);
  let moisture = example["moisture"][example["moisture"].length - 1] + Math.random() * 10 - 5;
  if (moisture > 100) {
    moisture = 100
  } else if (moisture < 0) {
    moisture = 0
  }
  example["moisture"].push(moisture);
}

export const getTestData = (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  updateData();
  res.json(JSON.stringify(example));
};

export const getVariableNames = (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(JSON.stringify(variableList));
};

export const postString = (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const inputString: string = req.body.autoScript;
  console.log(`Received string: ${inputString}`);
  // Here you can add the code to send the string to the embedded device
  res.status(200).send({ status: 'success', message: 'String received' });
};
