import { _decorator, Component, Node, tween, Vec3, input, Input, NodeEventType } from 'cc';
import {getParentByName} from "db://assets/Scripts/utils/utils";
const { ccclass, property } = _decorator;

@ccclass('PlantOpr')
export class PlantOpr extends Component {

    scale = new Vec3(0.7, 0.7);

    private _topNode: Node | null = null;

    start() {
    }

    private onTouchEnd() {
        this.hide();
    }

    hide() {
        if (this.node.active) {
            this.node.active = false;
            this._topNode.off(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        }
    }

    show() {
        if (this.node.active) return;
        this.node.active = true;
        if (!this._topNode) {
            this._topNode = getParentByName(this, 'Canvas');
        }
        this._topNode.once(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.setScale(0, 0);
        tween(this.node.getScale()).to(0.25, this.scale, {
            easing: 'backInOut',
            onUpdate: (scale: Vec3) => {
                this.node.setScale(scale.x, scale.y);
            }
        }).start();
    }

    update(deltaTime: number) {
        
    }
}


