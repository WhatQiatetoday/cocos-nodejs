import { _decorator, Component, EditBox, Node } from 'cc';
import { NetworkManager } from '../Global/NetworkManager';
import { ApiMsgEnum } from '../Common';
import DataManager from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {
    @property(EditBox) input: EditBox = null


    protected onLoad(): void {

    }

    async start() {
        await NetworkManager.Instance.connet()
    }

    async handleClick() {
        if (!NetworkManager.Instance.isConnected) {
            console.log("未连接！")
            return await NetworkManager.Instance.connet()
        }
        const nickname = this.input.string
        if (!nickname) return console.log("请输入昵称！")
        const { res, error, success } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiPlayerJoin, {
            nickname
        })
        if (!success) return console.log(error)
        DataManager.Instance.myPlayerId = res.player.id
        console.log("res:", res)
    }

    update(deltaTime: number) {

    }
}

