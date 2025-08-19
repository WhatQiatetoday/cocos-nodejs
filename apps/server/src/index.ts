import { ApiMsgEnum } from "./Common";
import { Connection, MyServer } from "./Core";
import { symlinkCommon } from "./Utils";

symlinkCommon();

const server = new MyServer({
    port: 9876,
})

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection: Connection, data: any) => {
    return data + '我是服务端，我知道了'
})

server.start()
    .then(() => { console.log("服务器启动成功") })
    .catch((e) => { console.log(e) })


// const wss = new WebSocketServer({ port: 9876 });

// let inputs = [];

// wss.on("connection", (ws) => {
//     ws.on("message", (buffer) => {
//         const str = buffer.toString();
//         try {
//             const msg = JSON.parse(str);
//             const { name, data } = msg;
//             const { frameId, input } = data;
//             inputs.push(input);
//         } catch (error) {
//             console.log(error);
//         }

//         setInterval(() => {
//             const temp = inputs;
//             inputs = [];
//             const obj = {
//                 name: ApiMsgEnum.MsgServerSync,
//                 data: {
//                     inputs: temp
//                 }
//             }
//             ws.send(JSON.stringify(obj));
//             console.log("发送同步数据", obj);

//         }, 100);
//     });
//     ws.on("close", () => {
//         console.log("客户端已断开连接");
//     });
//     ws.on("error", (err) => {
//         console.log("发生错误:", err);
//     });
//     ws.on("ping", () => {
//         console.log("收到心跳包");
//     });
//     ws.on("pong", () => {
//         console.log("收到心跳包回复");
//     });
// });

// wss.on("listening", () => {
//     console.log("服务器已启动");
// });

