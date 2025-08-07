import { _decorator, instantiate } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { EntityTypeEnum, IActor } from '../../Common';
import { EntityStateEnum } from '../../Enum';
import DataManager from '../../Global/DataManager';
import { WeaponStateMachine } from './WeaponStateMachine';
const { ccclass, property } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager {
    private body: Node = null;
    private anchor: Node = null;
    private point: Node = null;

    init(data: IActor) {
        this.fsm = this.node.addComponent(WeaponStateMachine);
        this.fsm.init(data.weaponType);
        this.state = EntityStateEnum.Idle;
        const weapon = instantiate(DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1));
        weapon.parent = this.node;
    }
}

