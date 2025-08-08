import { _decorator, instantiate, Node } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { EntityTypeEnum, IActor } from '../../Common';
import { EntityStateEnum, EventEnum } from '../../Enum';
import DataManager from '../../Global/DataManager';
import EventManager from '../../Global/EventManager';
import { WeaponStateMachine } from './WeaponStateMachine';
const { ccclass, property } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager {
    private body: Node = null;
    private anchor: Node = null;
    private point: Node = null;

    init(data: IActor) {
        this.body = this.node.getChildByName("Body");
        this.anchor = this.body.getChildByName("Anchor");
        this.point = this.anchor.getChildByName("Point");

        this.fsm = this.node.addComponent(WeaponStateMachine);
        this.fsm.init(data.weaponType);
        this.state = EntityStateEnum.Idle;
        const weapon = instantiate(DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1));
        weapon.parent = this.node;

        EventManager.Instance.on(EventEnum.WeaponShoot, this.handleWeaponShoot, this);
    }

    handleWeaponShoot() {

    }

}

