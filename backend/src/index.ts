import express from 'express'
import Aedes from 'aedes'
import net from 'net'
const app = express()  
const aedes: Aedes = new Aedes();
const mqttbroker = net.createServer(aedes.handle);
const port = 3000;  
const mqttPort = 1883; // Standard MQTT port

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

mqttbroker.listen(mqttPort, function () {
  console.log('MQTT Broker listening on port', mqttPort);
});

// Optional: You can listen to events, e.g., when a client connects or publishes
aedes.on('client', function (client) {
  console.log('Client connected:', client.id);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('Message published by client', client.id, 'on topic', packet.topic);
  }
});

/*aedes.on('subscribe', (packet, client) =>{
  if (client) {
    console.log('client', client.id, 'subscribed to topic', packet.topic.toString());
  }
})*/