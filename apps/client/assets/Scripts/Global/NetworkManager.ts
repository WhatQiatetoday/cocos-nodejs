import Singleton from "../Base/Singleton";
import { IModel } from "../Common";

interface Iitem {
    cb: Function,
    ctx: unknown
}

interface ICallApiRet<T> {
    success: boolean,
    error?: Error,
    res?: T
}

export class NetworkManager extends Singleton {
    isConnected: boolean = false;
    port = 9876;
    ws: WebSocket;

    private map: Map<string, Array<Iitem>> = new Map();

    public static get Instance() {
        return super.GetInstance<NetworkManager>();
    }

    connet() {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                resolve(true);
                return;
            }

            this.ws = new WebSocket(`ws://localhost:${this.port}`);
            this.ws.onopen = () => {
                this.isConnected = true;
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
                this.isConnected = false;

                reject(false);
            };
            this.ws.onclose = () => {
                this.isConnected = false;

                reject(false);
            };
        })
    }

    callApi<T extends keyof IModel['api']>(name: T, data: IModel['api'][T]['req']): Promise<ICallApiRet<IModel['api'][T]['res']>> {
        return new Promise((resolve, reject) => {
            try {
                const timer = setTimeout(() => {
                    resolve({ success: false, error: new Error("Time out !") })
                    this.unlistenMsg(name as any, cb, null)
                }, 5000);
                const cb = (res) => {
                    this.unlistenMsg(name as any, cb, null)
                    clearTimeout(timer);
                    resolve(res)
                }
                this.listenMsg(name as any, cb, null)
                this.sendMsg(name as any, data)
            } catch (error) {
                resolve({ success: false, error: error })
            }
        })
    }

    sendMsg<T extends keyof IModel['msg']>(name: T, data: IModel['msg'][T]) {
        const obj = { name, data }
        this.ws.send(JSON.stringify(obj));
    }

    listenMsg<T extends keyof IModel['msg']>(name: T, cb: (args: IModel['msg'][T]) => void, ctx: unknown) {
        if (this.map.has(name)) {
            this.map.get(name).push({ cb, ctx });
        } else {
            this.map.set(name, [{ cb, ctx }]);
        }
    }

    unlistenMsg<T extends keyof IModel['msg']>(name: T, cb: (args: IModel['msg'][T]) => void, ctx: unknown) {
        if (this.map.has(name)) {
            const index = this.map.get(name).findIndex((i) => i.cb === cb && i.ctx === ctx);
            index > -1 && this.map.get(name).splice(index, 1);
        }
    }
}