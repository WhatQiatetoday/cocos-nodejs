import { _decorator, Component, Label } from 'cc';
import { IRoom } from '../Common';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    init({ id, players }: IRoom) {
        this.node.getComponent(Label).string = id.toString()
        this.node.active = true;
    }


    start() {

    }

    update(deltaTime: number) {

    }
}

