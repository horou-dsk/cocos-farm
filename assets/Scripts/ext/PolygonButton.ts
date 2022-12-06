import {
    _decorator,
    Component,
    input,
    Input,
    Node,
    EventTouch,
    PolygonCollider2D,
    Intersection2D,
    UITransform,
    Vec3,
    Vec2,
    Color,
    UIRenderer,
    EventHandler,
    NodeEventType,
    EventMouse
} from 'cc';
// import { } from 'cc.decorator';
const {ccclass, property} = _decorator;

const _tempColor = new Color();

enum StateName {
    Normal,
    Hover,
    Press
}

export enum Transition {
    None,
    Color,
}

@ccclass('PolygonButton')
export class PolygonButton extends Component {

    private _isTouch = false;

    private _isHover = false;

    private p = 0;

    private _transitionFinished = true;

    public transition = Transition.Color;

    @property(Node)
    topNode: Node = null;

    @property(Color)
    normalColor: Color = Color.WHITE.clone();

    @property(Color)
    hoverColor: Color = Color.WHITE.clone();

    @property(Color)
    pressedColor: Color = new Color(211, 211, 211, 255);

    @property(Color)
    disabledColor: Color = new Color(255, 255, 255, 166);

    @property
    t = 0.4;

    @property([EventHandler])
    public clickEvents: EventHandler[] = [];

    private _renderComp: UIRenderer;

    private _uiTransform: UITransform;

    private _fromColor = new Color();
    private _toColor = new Color();

    private _collider: PolygonCollider2D | null;

    private _disabled = false;
    public get disabled() {
        return this._disabled;
    }
    public set disabled(value) {
        this._disabled = value;
        if (value) {
            this._isHover = false;
            this._isTouch = false;
            this._renderComp.color = this.disabledColor.clone();
        }
    }

    start() {
        this._renderComp = this.node.getComponent(UIRenderer);
        this._uiTransform = this.node.getComponent(UITransform);
        this._collider = this.node.getComponent(PolygonCollider2D);
        this.topNode.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.topNode.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.topNode.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.topNode.on(NodeEventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onDestroy() {
        this.topNode.off(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.topNode.off(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.topNode.off(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.topNode.off(NodeEventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    private onTouchEnd(_event: EventTouch) {
        if (this._disabled) return;
        if (this._isTouch) {
            this._updateColorTransition(StateName.Normal);
            if (this._isHover && this._isTouch) {
                EventHandler.emitEvents(this.clickEvents, this);
            }
            this._isTouch = false;
        }
        this._isHover = false;
    }

    private onMouseMove(event?: EventMouse) {
        if (this._disabled) return;
        if (!event && this._isTouch) return;
        const hit = this.checkBtnPolygonCollider(event.getUILocation());
        if (hit && !this._isHover) {
            this._isHover = true;
            this._updateColorTransition(StateName.Hover);
        }
        if (!hit && this._isHover) {
            this._isHover = false;
            this._updateColorTransition(StateName.Normal);
        }
    }

    private onTouchMove(event?: EventTouch) {
        if (this._disabled) return;
        if (!event && !event.touch) return;
        // event.preventSwallow = true;
        const hit = this.checkBtnPolygonCollider(event.touch.getUILocation());
        if (hit && !this._isHover) {
            this._isHover = true;
            if (this._isTouch) {
                this._updateColorTransition(StateName.Press);
            } else {
                this._updateColorTransition(StateName.Hover);
            }
        }
        if (!hit && this._isHover) {
            this._isHover = false;
            this._updateColorTransition(StateName.Normal);
        }
    }

    private onTouchStart(event: EventTouch) {
        if (this._disabled) return;
        this._isTouch = this.checkBtnPolygonCollider(event.touch.getUILocation());
        if (this._isTouch) {
            this._isHover = true;
            this._updateColorTransition(StateName.Press);
        }
    }

    private _updateColorTransition(state: StateName) {
        if (this.transition !== Transition.Color) return;
        this._fromColor = this._renderComp.color.clone();
        if (state === StateName.Normal) {
            this._toColor = this.normalColor;
        } else if (state === StateName.Hover) {
            this._toColor = this.hoverColor;
        } else {
            this._toColor = this.pressedColor;
        }
        this.p = 0;
        this._transitionFinished = false;
    }

    private checkBtnPolygonCollider(local: Vec2) {
        let collider = this._collider;
        if (collider) {
            let points = collider.points;
            const tf = this._uiTransform;
            const nodeLocal = tf.convertToNodeSpaceAR(new Vec3(local.x, local.y));
            return Intersection2D.pointInPolygon(new Vec2(nodeLocal.x, nodeLocal.y), points);
        } else {
            return false;
        }
    }

    update(deltaTime: number) {
        if (this._transitionFinished) return;
        this.p += deltaTime;
        let ratio = 1.0;
        if (this.t > 0) {
            ratio = this.p / this.t;
        }
        if (ratio >= 1) {
            ratio = 1;
        }
        this.p += deltaTime;
        if (Transition.Color === this.transition) {
            Color.lerp(_tempColor, this._fromColor, this._toColor, ratio);
        }
        this._renderComp.color = _tempColor;
        if (ratio === 1) {
            this._transitionFinished = true;
        }
    }
}


