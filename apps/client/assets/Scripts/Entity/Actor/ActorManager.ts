import { _decorator, Component, Vec3 } from 'cc';
import { IActor, InputTypeEnum } from '../../Common';
import DataManager from '../../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends Component {
    start() {

    }

    update(deltaTime: number) {
        if (DataManager.Instance.jm?.input?.length()) {
            const { x, y } = DataManager.Instance.jm.input;
            DataManager.Instance.applyInput({
                id: 1,
                type: InputTypeEnum.ActorMove,
                direction: { x, y },
                deltaTime,
            })
            console.log(DataManager.Instance.state.actors[0].position);
        }
    }

    init(data: IActor) {

    }

    render(data: IActor) {
        this.node.position = new Vec3(data.position.x, data.position.y, 0);
    }
}

