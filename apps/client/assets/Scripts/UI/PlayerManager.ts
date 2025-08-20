import { _decorator, Component, Label } from 'cc';
import { IPlayer } from '../Common';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {

    init({ id, nickname, rid }: IPlayer) {
        this.node.getComponent(Label).string = nickname
        this.node.active = true;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

