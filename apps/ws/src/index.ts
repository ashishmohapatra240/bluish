import { WebSocket, WebSocketServer } from "ws";
import { redis } from "@repo/shared";
const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", async (socket) => {
  await redis.subscribe("get:date");

  redis.on("message", (channel, msg) => {
    if(channel === "get:date"){
        console.log("from redis", msg);
        socket.send(`from redis: ${msg}`);
    }
  });
});
