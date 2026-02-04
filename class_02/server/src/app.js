import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();

const node_server = createServer(app);

const socket = new Server(node_server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
socket.on("connection", (client) => {
  console.log("User connected", client.id);

  client.on("message", (data) => {
    socket.emit("message", data); // Broadcast to all connected clients
  });
});

app.get("/", (req, res) => {
  res.send("AFRICA KI MUDRAA");
});

export default node_server;
