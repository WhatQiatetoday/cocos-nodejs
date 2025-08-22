import { _decorator, Component, director, instantiate, Node, Prefab } from 'cc';
import { ApiMsgEnum, IMsgGameStart, IMsgRoom } from '../Common';
import { SceneEnum } from '../Enum';
import DataManager from '../Global/DataManager';
import { NetworkManager } from '../Global/NetworkManager';
import { PlayerManager } from '../UI/PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property(Node) playerContainer: Node = null
    @property(Prefab) playerPrefab: Prefab = null

    protected onLoad(): void {
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgRoom, this.renderPlayer, this);
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgGameStart, this.handleGameStart, this);
    }

    protected start(): void {
        this.playerContainer.destroyAllChildren()
        this.renderPlayer({
            room: DataManager.Instance.roomInfo
        })
    }

    protected onDestroy(): void {
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgRoom, this.renderPlayer, this);
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgGameStart, this.handleGameStart, this);
    }

    renderPlayer({ room: { players: list } }: IMsgRoom) {
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

    async handleLeaveRoom() {
        const { res, error, success } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomLeave, {})
        if (!success) return console.log(error)
        DataManager.Instance.roomInfo = null
        director.loadScene(SceneEnum.Hall)
    }

    // 开始游戏按钮
    async handleStart() {
        const { res, error, success } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiGameStart, {})
        if (!success) return console.log(error)
    }

    // 后端返回开始游戏
    handleGameStart({ state }: IMsgGameStart) {
        DataManager.Instance.state = state
        director.loadScene(SceneEnum.Battle)
    }

    update(deltaTime: number) {

    }
}

