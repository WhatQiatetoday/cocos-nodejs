import Singleton from "../Base/Singleton";
import { ApiMsgEnum } from "../Common";
import PlayerManager from "./PlayerManager";
import { Room } from "./Room";

export default class RoomManager extends Singleton {
    static get Instance() {
        return super.GetInstance<RoomManager>();
    }

    nextRoomId: number = 1
    rooms: Set<Room> = new Set()
    idMapRoom: Map<number, Room> = new Map()

    createRoom() {
        const room = new Room(this.nextRoomId++)
        this.rooms.add(room)
        this.idMapRoom.set(room.id, room)
        return room
    }

    joinRoom(rid: number, uid: number) {
        const room = this.idMapRoom.get(rid)
        if (room) {
            room.join(uid)
            return room
        }
    }

    // removePlayer(pid: number) {
    //     const room = this.idMapRoom.get(pid)
    //     if (room) {
    //         this.rooms.delete(room)
    //         this.idMapRoom.delete(room.id)
    //     }
    // }

    syncRooms() {
        for (const player of PlayerManager.Instance.players) {
            player.connection.sendMsg(ApiMsgEnum.MsgRoomList, {
                list: this.getRoomsView()
            })
        }
    }

    getRoomView({ id, players }: Room) {
        return { id, players: PlayerManager.Instance.getPlayersView(players) }
    }

    getRoomsView(rooms: Set<Room> = this.rooms) {
        return [...rooms].map(room => this.getRoomView(room))
    }
}
