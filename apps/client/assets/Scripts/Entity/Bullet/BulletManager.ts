import { _decorator, Vec3 } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { EntityTypeEnum, IBullet } from '../../Common';
import { EntityStateEnum } from '../../Enum';
import { rad2Angle } from '../../Utils';
import { BulletStateMachine } from './BulletStateMachine';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {

    type: EntityTypeEnum;

    start() {

    }

    init(data: IBullet) {
        this.fsm = this.node.addComponent(BulletStateMachine);
        this.fsm.init(data.type);
        this.state = EntityStateEnum.Idle;
        this.type = data.type;
    }

    render(data: IBullet) {
        const { id, type, position, direction } = data;
        this.node.position = new Vec3(position.x, position.y, 0);
        // this.node.setScale(v3(direction.x > 0 ? 1 : -1, 1, 1));
        const side = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        const rad = direction.x > 0 ? Math.asin(direction.y / side) : Math.asin(-direction.y / side);
        const angle = direction.x > 0 ? rad2Angle(rad) : rad2Angle(rad) + 180;
        this.node.setRotationFromEuler(new Vec3(0, 0, angle));
    }
}