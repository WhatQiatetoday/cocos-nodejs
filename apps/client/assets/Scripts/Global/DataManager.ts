import { Node, Prefab, SpriteFrame } from "cc";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum, IBullet, IClientInput, InputTypeEnum, IState } from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import { JoyStickManager } from "../UI/JoyStickManager";

const ACTOR_SPEED = 100;

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  jm: JoyStickManager;
  stage: Node;
  actorMap: Map<number, ActorManager> = new Map();
  bulletMap: Map<number, BulletManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map();
  textureMap: Map<string, SpriteFrame[]> = new Map();

  state: IState = {
    actors: [
      {
        id: 1,
        type: EntityTypeEnum.Actor1,
        weaponType: EntityTypeEnum.Weapon1,
        bulletType: EntityTypeEnum.Bullet1,
        position: {
          x: 0,
          y: 0
        },
        direction: {
          x: 1,
          y: 1
        }
      }
    ],
    bullets: [],
    nextBulletId: 1
  }

  applyInput(input: IClientInput) {
    switch (input.type) {
      case InputTypeEnum.ActorMove: {
        const { id, type, direction, deltaTime } = input;
        const actor = this.state.actors.find(actor => actor.id === id);
        actor.direction = direction;

        actor.position.x += direction.x * deltaTime * ACTOR_SPEED;
        actor.position.y += direction.y * deltaTime * ACTOR_SPEED;
        break;
      }
      case InputTypeEnum.WeaponShoot: {
        const { owner, direction, position } = input;
        const bullet: IBullet = {
          id: this.state.nextBulletId++,
          owner,
          position,
          direction,
          type: this.actorMap.get(owner).bulletType
        }
        this.state.bullets.push(bullet);

      }

      default:
        break;
    }
  }
}
