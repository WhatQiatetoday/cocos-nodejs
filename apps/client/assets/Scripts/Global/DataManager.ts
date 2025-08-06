import { Prefab, SpriteFrame } from "cc";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum, IActorMove, IState } from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { JoyStickManager } from "../UI/JoyStickManager";

const ACTOR_SPEED = 100;

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  jm: JoyStickManager;
  actorMap: Map<number, ActorManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map();
  textureMap: Map<string, SpriteFrame> = new Map();

  state: IState = {
    actors: [
      {
        id: 1,
        type: EntityTypeEnum.Actor1,
        position: {
          x: 0,
          y: 0
        },
        direction: {
          x: 1,
          y: 1
        }
      }
    ]
  }

  applyInput(input: IActorMove) {
    const { id, type, direction, deltaTime } = input;
    const actor = this.state.actors.find(actor => actor.id === id);
    actor.direction = direction;

    actor.position.x += direction.x * deltaTime * ACTOR_SPEED;
    actor.position.y += direction.y * deltaTime * ACTOR_SPEED;
  }
}
