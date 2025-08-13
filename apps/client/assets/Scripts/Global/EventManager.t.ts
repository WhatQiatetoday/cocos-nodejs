import Singleton from "../Base/Singleton";

interface Iitem {
    func: Function,
    ctx: any
}

export class EventManager_t extends Singleton {
    public static get Instance() {
        return super.GetInstance<EventManager_t>();
    }

    private eventMap: Map<string, Array<Iitem>> = new Map();

    on(eventName: string, func: Function, ctx: any) {
        if (this.eventMap.has(eventName)) {
            this.eventMap.get(eventName).push({ func, ctx });
        } else {
            this.eventMap.set(eventName, [{ func, ctx }]);
        }
    }

    off(eventName: string, func: Function, ctx: any) {
        if (this.eventMap.has(eventName)) {
            const index = this.eventMap.get(eventName).findIndex((i) => i.func === func && i.ctx === ctx);
            index > -1 && this.eventMap.get(eventName).splice(index, 1);
        }
    }

    emit(eventName: string, ...args: any[]) {
        if (this.eventMap.has(eventName)) {
            this.eventMap.get(eventName).forEach(({ func, ctx }) => func.apply(ctx, args));
        }
    }

    clear() {
        this.eventMap.clear();
    }
}