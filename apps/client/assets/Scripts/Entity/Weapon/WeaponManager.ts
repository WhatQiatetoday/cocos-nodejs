import { _decorator, instantiate, Node, UITransform } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { EntityTypeEnum, IActor, InputTypeEnum } from '../../Common';
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
    private owner: number = 0;

    init(data: IActor) {
        this.body = this.node.getChildByName("Body");
        this.anchor = this.body.getChildByName("Anchor");
        this.point = this.anchor.getChildByName("Point");
        this.owner = data.id;

        this.fsm = this.node.addComponent(WeaponStateMachine);
        this.fsm.init(data.weaponType);
        this.state = EntityStateEnum.Idle;
        const weapon = instantiate(DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1));
        weapon.parent = this.node;

        EventManager.Instance.on(EventEnum.WeaponShoot, this.handleWeaponShoot, this);
    }

    handleWeaponShoot() {
        const pointWorldPos = this.point.worldPosition;
        const pointLocalPos = DataManager.Instance.stage.getComponent(UITransform).convertToNodeSpaceAR(pointWorldPos);
        const anchorWorldPos = this.anchor.worldPosition;
        const anchorLocalPos = DataManager.Instance.stage.getComponent(UITransform).convertToNodeSpaceAR(anchorWorldPos);
        const direction = {
            x: pointLocalPos.x - anchorLocalPos.x,
            y: pointLocalPos.y - anchorLocalPos.y,
        }

        DataManager.Instance.applyInput({
            owner: this.owner,
            type: InputTypeEnum.WeaponShoot,
            position: pointLocalPos,
            direction,
        })

        console.log(DataManager.Instance.state.bullets);
    }

    protected onDestroy(): void {
        EventManager.Instance.off(EventEnum.WeaponShoot, this.handleWeaponShoot, this);

    }

}

