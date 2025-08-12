import { _decorator, instantiate, Vec3 } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { EntityTypeEnum, IBullet, IVec2 } from '../../Common';
import { EntityStateEnum, EventEnum } from '../../Enum';
import DataManager from '../../Global/DataManager';
import EventManager from '../../Global/EventManager';
import { rad2Angle } from '../../Utils';
import { ExplosionManager } from '../Explosion/ExplosionManager';
import { BulletStateMachine } from './BulletStateMachine';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {

    type: EntityTypeEnum;
    id: number;

    start() {

    }

    init(data: IBullet) {
        this.fsm = this.node.addComponent(BulletStateMachine);
        this.fsm.init(data.type);
        this.id = data.id;
        this.state = EntityStateEnum.Idle;
        this.type = data.type;

        EventManager.Instance.on(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
    }

    handleExplosionBorn(id: number, pos: IVec2) {
        if (id != this.id) return;
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Explosion);
        const explosion = instantiate(prefab);
        explosion.parent = DataManager.Instance.stage;
        const explosionManager = explosion.addComponent(ExplosionManager);
        explosionManager.init(EntityTypeEnum.Explosion, pos);
        this.node.destroy();
        EventManager.Instance.off(EventEnum.ExplosionBorn, this.handleExplosionBorn, this);
        DataManager.Instance.bulletMap.delete(this.id);
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