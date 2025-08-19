import Singleton from "../Base/Singleton";

interface Iitem {
    cb: Function,
    ctx: unknown
}

export class NetworkManager extends Singleton {
    port = 9876;
    ws: WebSocket;

    private map: Map<string, Array<Iitem>> = new Map();

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
                const obj = JSON.parse(event.data);
                const { name, data } = obj;
                if (this.map.has(name)) {
                    this.map.get(name).forEach(({ cb, ctx }) => {
                        cb.call(ctx, data);
                    })
                }
            };
            this.ws.onerror = (error) => {
                reject(false);
            };
            this.ws.onclose = () => {
                reject(false);
            };
        })
    }

    sendMsg(name: string, data: any) {
        const obj = { name, data }
        this.ws.send(JSON.stringify(obj));
    }

    listenMsg(name: string, cb: Function, ctx: unknown) {
        if (this.map.has(name)) {
            this.map.get(name).push({ cb, ctx });
        } else {
            this.map.set(name, [{ cb, ctx }]);
        }
    }

    unlistenMsg(name: string, cb: Function, ctx: unknown) {
        if (this.map.has(name)) {
            const index = this.map.get(name).findIndex((i) => i.cb === cb && i.ctx === ctx);
            index > -1 && this.map.get(name).splice(index, 1);
        }
    }
}