const http = require('node:http');
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const mqttPort = 1883; // Standard MQTT port

const hostname = '192.168.1.106';
const port = 3000;

server.listen(mqttPort, function () {
  console.log('MQTT Broker listening on port', mqttPort);
});

// Optional: You can listen to events, e.g., when a client connects or publishes
aedes.on('client', function (client) {
  console.log('Client connected:', client.id);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('Message published by client', client.id, 'on topic', packet.topic.toString());
  }
});

aedes.on('subscribe', (packet, client) =>{
  if (client) {
    console.log('client', client.id, 'subscribed to topic', packet.topic.toString());
  }
})