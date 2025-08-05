import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ActorManager } from '../Entity/Actor/ActorManager';
import DataManager from '../Global/DataManager';
import { ResourceManager } from '../Global/ResourceManager';
import { JoyStickManager } from '../UI/JoyStickManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    @property(Node) stage: Node = null;
    @property(Node) ui: Node = null;

    protected onLoad(): void {
        DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager);
    }

    update(deltaTime: number) {
        this.render();
    }

    render() {
        this.renderActor()
    }

    async renderActor() {
        for (let data of DataManager.Instance.state.actors) {
            let actorManager = DataManager.Instance.actorMap.get(data.id);
            if (!actorManager) {
                const prefab = await ResourceManager.Instance.loadRes("Prefab/Actor", Prefab);
                const actor = instantiate(prefab);
                actor.parent = this.stage;
                actorManager = actor.addComponent(ActorManager);
                DataManager.Instance.actorMap.set(data.id, actorManager);
                actorManager.init(data);
            }
            actorManager.render(data);
        }
    }
}

