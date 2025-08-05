import { _decorator, Component, EventTouch, Input, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStickManager')
export class JoyStickManager extends Component {
    @property(Node) body: Node = null;
    @property(Node) stick: Node = null;
    private defaultPos: Vec3 = new Vec3();
    private radius: number = 0;

    public input: Vec3;
    protected onLoad(): void {

    }

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.defaultPos = this.body.position.clone();
        this.radius = this.body.getComponent(UITransform).contentSize.width / 2;
    }

    onTouchStart(e: EventTouch) {
        const location = e.getUILocation();
        this.body.setWorldPosition(location.x, location.y, 0);
    }

    onTouchEnd(e: EventTouch) {
        this.body.setPosition(this.defaultPos);
        this.stick.setPosition(0, 0);
        this.input = Vec3.ZERO;
    }

    onTouchMove(e: EventTouch) {
        const location = e.getUILocation();
        const bodyWorldPos = this.body.getWorldPosition();

        // 计算stick相对于body中心的偏移
        const offset = new Vec3(location.x - bodyWorldPos.x, location.y - bodyWorldPos.y, 0);

        // 计算距离
        const distance = offset.length();

        // 如果距离超过半径，则限制在半径范围内
        if (distance > this.radius) {
            offset.normalize();
            offset.multiplyScalar(this.radius);
        }

        // 设置stick的世界位置
        const stickWorldPos = new Vec3(bodyWorldPos.x + offset.x, bodyWorldPos.y + offset.y, 0);
        this.stick.setWorldPosition(stickWorldPos);
        this.input = offset.normalize();
        // console.log(offset.normalize());
    }

    onTouchCancel(e: EventTouch) {
        this.body.setPosition(this.defaultPos);
        this.stick.setPosition(0, 0);
        this.input = Vec3.ZERO;
    }

    update(deltaTime: number) {

    }
}

