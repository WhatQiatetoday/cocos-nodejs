import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ApiMsgEnum, IApiPlayerListRes } from '../Common';
import { NetworkManager } from '../Global/NetworkManager';
import { PlayerManager } from '../UI/PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('HallManager')
export class HallManager extends Component {
    @property(Node) playerContainer: Node = null
    @property(Prefab) playerPrefab: Prefab = null


    protected start(): void {
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
        this.playerContainer.destroyAllChildren()
        this.getPlayers()
    }

    protected onDestroy(): void {
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
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

    update(deltaTime: number) {

    }
}

