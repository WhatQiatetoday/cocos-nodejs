import { _decorator, Component, director, instantiate, Node, Prefab } from 'cc';
import { ApiMsgEnum, IApiPlayerListRes, IApiRoomListRes } from '../Common';
import { EventEnum, SceneEnum } from '../Enum';
import DataManager from '../Global/DataManager';
import EventManager from '../Global/EventManager';
import { NetworkManager } from '../Global/NetworkManager';
import { PlayerManager } from '../UI/PlayerManager';
import { RoomManager } from '../UI/RoomManager';
const { ccclass, property } = _decorator;

@ccclass('HallManager')
export class HallManager extends Component {
    @property(Node) playerContainer: Node = null
    @property(Prefab) playerPrefab: Prefab = null
    @property(Node) roomContainer: Node = null
    @property(Prefab) roomPrefab: Prefab = null

    protected onLoad(): void {
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this);
        EventManager.Instance.on(EventEnum.RoomJoin, this.handleJoinRoom, this)
    }

    protected start(): void {
        this.roomContainer.destroyAllChildren()
        this.playerContainer.destroyAllChildren()
        this.getPlayers()
        this.getRooms()
    }

    protected onDestroy(): void {
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this);
        EventManager.Instance.off(EventEnum.RoomJoin, this.handleJoinRoom, this)

    }

    async getPlayers() {
        const { res, error, success } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiPlayerList, {})
        if (!success) return console.log(error)
        console.log("res:", res)
        this.renderPlayer(res)
    }

    renderPlayer({ list }: IApiPlayerListRes) {
        for (const c of this.playerContainer.children) {
            c.active = false
        }
        for (let i = 0; i < list.length; i++) {
            let item = this.playerContainer.children[i]
            if (!item) {
                const newNode = instantiate(this.playerPrefab)
                newNode.parent = this.playerContainer
                item = newNode
            }
            item.getComponent(PlayerManager).init(list[i])
        }
    }

    async handleCreateRoom() {
        const { res, error, success } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomCreate, {})
        if (!success) return console.log(error)
        DataManager.Instance.roomInfo = res.room
        console.log("Datamanager.Instance.roomInfo:", DataManager.Instance.roomInfo)
        director.loadScene(SceneEnum.Room)
    }

    async getRooms() {
        const { res, error, success } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomList, {})
        if (!success) return console.log(error)
        console.log("res:", res)
        this.renderRoom(res)
    }

    renderRoom({ list }: IApiRoomListRes) {
        for (const c of this.roomContainer.children) {
            c.active = false
        }
        for (let i = 0; i < list.length; i++) {
            let item = this.roomContainer.children[i]
            if (!item) {
                const newNode = instantiate(this.roomPrefab)
                newNode.parent = this.roomContainer
                item = newNode
            }
            item.getComponent(RoomManager).init(list[i])
        }
    }

    async handleJoinRoom(rid: number) {
        const { res, error, success } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomJoin, { rid })
        if (!success) return console.log(error)
        DataManager.Instance.roomInfo = res.room
        console.log("Datamanager.Instance.roomInfo:", DataManager.Instance.roomInfo)
        director.loadScene(SceneEnum.Room)
    }

    update(deltaTime: number) {

    }
}

