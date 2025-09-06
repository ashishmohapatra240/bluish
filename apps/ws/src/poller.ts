import { WebSocket, WebSocketServer } from "ws";
import { redis } from "@repo/shared";

const wss = new WebSocketServer({ port: 8080 });
const ws = new WebSocket("ws://localhost:8080");

wss.on("connection", (socket) => {
  console.log("connected");
  socket.on("message", () => {
    const interval = setInterval(async () => {
      await redis.publish("get:date", JSON.stringify(new Date().toISOString()));
      socket.send(`server time: ${new Date().toISOString()}`);
    }, 1000);

    socket.on("close", () => {
      clearInterval(interval);
    });
  });
});

ws.on("open", () => {
  console.log("client connected");
  ws.send("hello from client");
});

ws.on("message", (msg) => {
  console.log("time", msg.toString());
});
