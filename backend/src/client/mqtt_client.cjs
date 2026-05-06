const mqtt = require("mqtt");
const fs = require("fs");
const readline = require("node:readline");
const client = mqtt.connect("mqtt://192.168.1.104");
const options = {
  retain: true, // Set the retain flag to true
  qos: 1, // Optional: Quality of Service level
};
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "GalliumBroke> ",
});
myTopic = new String();

client.on("connect", () => {
  console.log("Connected to the Broker");
  rl.prompt();
});

rl.on("line", (input) => {
  switch (input.trim()) {
    case "subscribe":
      rl.question("Topic: ", (answer) => {
        client.subscribe(answer, (err) => {
          if (err) {
            console.log("Error,", err);
          } else {
            console.log("Subscribed to topic", answer);
            myTopic = answer;
          }
          rl.prompt();
        });
      });
      break;
    case "publish":
      rl.question("Message: ", (answer1) => {
        rl.question("Topic: ", (answer2) => {
          client.publish(answer2, answer1, options, (err) => {
            if (err) {
              console.log("Error,", err);
            } else {
              console.log("Message published in", answer2);
            }
            rl.prompt();
          });
        });
      });
      break;
    case "exit":
      console.log("Bye");
      rl.close();
      client.end();
      break;
    default:
      console.log("Dont understand, try again");
      rl.prompt();
      break;
  }
});

client.on("message", (topic, message) => {
  // message is a Buffer, convert it to a string
  console.log(`Received message on topic "${topic}": ${message.toString()}`);
  rl.prompt();
});

client.on("error", (err) => {
  console.error("Connection error: ", err);
  client.end();
});
