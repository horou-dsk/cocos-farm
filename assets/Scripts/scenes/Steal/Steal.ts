import { _decorator, Component, Node, UITransform, Vec3, Vec2, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Steal')
export class Steal extends Component {

    hide() {
        // this.node.setPosition(-1200, 0);
        const ui = this.node.getComponent(UITransform);
        tween(this.node).to(0.25, {position: new Vec3(-ui.contentSize.x, 0)}, {
            easing: 'quadIn',
        })
            .call(() => {
                this.node.setPosition(1200, 0);
            })
            .start();
    }

    show() {
        alert('暂未开放');
        return;
        const ui = this.node.getComponent(UITransform);
        const pos = new Vec2(0, -ui.contentSize.y);
        this.node.setPosition(0, -pos.y);

        tween(pos).to(0.25, new Vec2(0, 0), {
            easing: 'quadIn',
            onUpdate: (target: Vec2) => {
                this.node.setPosition(target.x, target.y);
            }
        }).start();
    }

}


