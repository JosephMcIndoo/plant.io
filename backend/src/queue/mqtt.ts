import mqtt from "mqtt";
import { config } from "dotenv";
config();

const client = mqtt.connect(process.env.MQTT_URL as string, {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`, //this client id is for testing purposes
  clean: true,
  connectTimeout: 5000,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
});

client.on("connect", () => {
  console.log("connected to mqtt");

  client.subscribe("plantio", (err) => {
    console.log(`subcribed to plantio`);
    if (err) {
      console.log(err.message);
    }
  });
});

client.on("message", (topic, msg) => {
  const message = msg.toString();

  console.log(`${topic} recieved: ${message}`);
});
