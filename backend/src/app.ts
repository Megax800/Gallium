import "reflect-metadata";
import express from "express";
//import Aedes from "aedes";
import net from "net";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io";
import { chatroomRouter } from "./chatroom/chatroom.routes.js";
import { messageRouter } from "./message/message.routes.js";
import { userRouter } from "./user/user.routes.js";
import { getORM, initORM } from "../shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { createServer } from "http";
const app = express();
//const aedes: Aedes = new Aedes();
//const mqttbroker = net.createServer(aedes.handle);
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CORS_URL, methods: ["GET", "POST"] },
});
const port = process.env.HTTP_PORT;
const mqttPort = process.env.MQTT_PORT; // Standard MQTT port

const startServer = async () => {
  if (process.env.NODE_ENV !== "test") {
    await initORM();
  }

  const orm = await getORM();

  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });

  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

app.use(cors());
app.use(express.json());
app.use("/api/chatroom", chatroomRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

if (process.env.NODE_ENV !== "test") {
  startServer();
}

/*mqttbroker.listen(mqttPort, function () {
  console.log("MQTT Broker listening on port", mqttPort);
});

// Optional: You can listen to events, e.g., when a client connects or publishes
aedes.on("client", function (client) {
  console.log("Client connected:", client.id);
});

aedes.on("publish", function (packet, client) {
  if (client) {
    console.log(
      "Message published by client",
      client.id,
      "on topic",
      packet.topic,
    );
  }
});*/

io.use((socket: any, next) => {
  const userId = socket.handshake.auth.token;

  socket.userId = userId;
  next();
});

io.on("connection", (socket: any) => {
  console.log("a user connected", socket.userId);
  socket.on("sendMessage", (message: any, room: string) => {
    socket.to(room).emit("receiveMessage", message);
  });
  socket.on("joinChat", (room: string) => {
    socket.join(room);
  });
  socket.on("leaveChat", (room: string) => {
    socket.leave(room);
  });
  socket.on("deleteMessage", (id: string, room: string) => {
    socket.to(room).emit("messageDeleted", id);
  });
  socket.on("deleteUser", (users: any, room: string) => {
    const allUsers = { users, room };
    socket.broadcast.emit("userDeleted", allUsers);
  });
});

export { app };

/*aedes.on('subscribe', (packet, client) =>{
  if (client) {
    console.log('client', client.id, 'subscribed to topic', packet.topic.toString());
  }
})*/
