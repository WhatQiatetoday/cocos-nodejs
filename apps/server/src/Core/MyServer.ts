import { WebSocket, WebSocketServer } from "ws";
import { ApiMsgEnum } from "../Common";
import { Connection } from "./Connection";
import { EventEmitter } from "stream";
export class MyServer extends EventEmitter {
    port: number
    wss: WebSocketServer
    connections: Set<Connection> = new Set()
    apiMap: Map<ApiMsgEnum, Function> = new Map()

    constructor({ port }: { port: number }) {
        super()
        this.port = port;
    }

    start() {
        this.wss = new WebSocketServer({ port: this.port });
        return new Promise((resolve, reject) => {
            this.wss.on("listening", () => { resolve(true) });
            this.wss.on("connection", (ws: WebSocket) => {
                const connection = new Connection(this, ws)
                this.connections.add(connection)
                this.emit("connection", connection)
                console.log("来人了", this.connections.size)
                connection.on("close", () => {
                    this.connections.delete(connection);
                    this.emit("disconnection", connection)

                    console.log("走人了", this.connections.size)
                })
            });
            this.wss.on("close", () => { reject(false) });
            this.wss.on("error", (e) => { reject(e) });
            this.wss.on("ping", () => { });
            this.wss.on("pong", () => { });
        })
    }

    setApi(name: ApiMsgEnum, cb: Function) {
        this.apiMap.set(name, cb)
    }
}