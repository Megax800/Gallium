const mqtt = require("mqtt");
const fs = require("fs");
const readline = require('node:readline');
const client = mqtt.connect("mqtt://192.168.1.110");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "GalliumBroke> "
});
myTopic = new String;

client.on("connect", () => {
    console.log("Connected to the Broker");
    rl.prompt();
});

rl.on('line', (input)=>{
    switch(input.trim()){
        case 'subscribe':
            rl.question("Topic: ", (answer) =>{
                client.subscribe(answer, (err) =>{
                    if(err){
                        console.log("Error,", err);
                    }else{
                        console.log('Subscribed to topic', answer);
                        myTopic = answer;
                    }
                    rl.prompt();
                });
            })
        break;
        case 'publish':
            rl.question("Message: ", (answer) =>{
                client.publish(myTopic, answer, (err) =>{
                  if(err){
                        console.log("Error,", err);
                    }else{
                        console.log('Message published in', myTopic);
                        myTopic = answer;
                    }
                    rl.prompt();
                });
            })
        break;
        case 'exit':
            console.log("Bye");
            rl.close();
            client.end();
        break;
        default:
            console.log("Dont understand, try again");
            rl.prompt();
        break;
    }
})

/*client.on("message", (topic, message) => {
    // message is a Buffer, convert it to a string
    console.log(`Received message on topic "${topic}": ${message.toString()}`);
    // End the connection after receiving the message (optional for simple examples)
    client.end();
});*/

client.on("error", (err) => {
    console.error("Connection error: ", err);
    client.end();
});


