import { _decorator, Component, v3, Vec3 } from 'cc';
import { IActor, InputTypeEnum } from '../../Common';
import DataManager from '../../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends Component {
    start() {

    }

    tick(deltaTime: number) {
        if (DataManager.Instance.jm?.input?.length()) {
            const { x, y } = DataManager.Instance.jm.input;
            DataManager.Instance.applyInput({
                id: 1,
                type: InputTypeEnum.ActorMove,
                direction: { x, y },
                deltaTime,
            })
            // console.log(DataManager.Instance.state.actors[0].position);
        }
    }

    init(data: IActor) {

    }

    render(data: IActor) {
        const { id, type, position, direction } = data;
        this.node.position = new Vec3(position.x, position.y, 0);
        this.node.setScale(v3(direction.x > 0 ? 1 : -1, 1, 1));
    }
}

