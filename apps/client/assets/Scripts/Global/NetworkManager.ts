import Singleton from "../Base/Singleton";

export class NetworkManager extends Singleton {
    port = 9876;
    ws: WebSocket;

    public static get Instance() {
        return super.GetInstance<NetworkManager>();
    }

    connet() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(`ws://localhost:${this.port}`);
            this.ws.onopen = () => {
                resolve(true);
            };
            this.ws.onmessage = (event) => {
                console.log("onmassage:", event.data)
                resolve(event.data);
            };
            this.ws.onerror = (error) => {
                reject(false);
            };
            this.ws.onclose = () => {
                reject(false);
            };
        })
    }

    sendMsg(msg: string) {
        this.ws.send(msg);
    }
}