import { WebSocketServer } from "ws";
import { symlinkCommon } from "./Utils";

symlinkCommon();

const wss = new WebSocketServer({ port: 9876 });

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log("收到消息:", message.toString());
    });
    ws.send("你好，客户端！");
    ws.on("close", () => {
        console.log("客户端已断开连接");
    });
    ws.on("error", (err) => {
        console.log("发生错误:", err);
    });
    ws.on("ping", () => {
        console.log("收到心跳包");
    });
    ws.on("pong", () => {
        console.log("收到心跳包回复");
    });
});

wss.on("listening", () => {
    console.log("服务器已启动");
});

