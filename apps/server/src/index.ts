import PlayerManager from "./Biz/PlayerManager";
import { ApiMsgEnum, IApiPlayerJoinReq, IApiPlayerJoinRes, IApiPlayerListReq, IApiPlayerListRes } from "./Common";
import { Connection, MyServer } from "./Core";
import { symlinkCommon } from "./Utils";

symlinkCommon();

declare module "./Core" {
    interface Connection {
        playerId: number
    }
}

const server = new MyServer({
    port: 9876,
})

server.on("connection", (connection: Connection) => {
    console.log("来人了", server.connections.size)
})

server.on("disconnection", (connection: Connection) => {
    console.log("有人走了", server.connections.size)
    if (connection.playerId) {
        PlayerManager.Instance.removePlayer(connection.playerId)
    }
    PlayerManager.Instance.syncPlayers()
    console.log("PlayerManager.Instance.players.size", PlayerManager.Instance.players.size)
})


server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection: Connection, data: IApiPlayerJoinReq): IApiPlayerJoinRes => {
    const { nickname } = data
    const player = PlayerManager.Instance.createPlayer({ nickname, connection })
    connection.playerId = player.id
    PlayerManager.Instance.syncPlayers()
    return { player: PlayerManager.Instance.getPlayerView(player) }
})

server.setApi(ApiMsgEnum.ApiPlayerList, (connection: Connection, data: IApiPlayerListReq): IApiPlayerListRes => {
    return { list: PlayerManager.Instance.getPlayersView() }
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

