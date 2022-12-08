import { _decorator, Component, Node, Vec2, UITransform, Vec3, tween, Label, instantiate } from 'cc';
import {FarmApi} from "db://assets/Scripts/api";
const { ccclass, property } = _decorator;

@ccclass('Rank')
export class Rank extends Component {

    @property(Label)
    myRank: Label = null;

    @property(Node)
    content: Node = null;

    @property(Node)
    item: Node = null;

    start() {
        this.item.active = false;
    }

    update(deltaTime: number) {
        
    }

    hide() {
        const ui = this.node.getComponent(UITransform);
        tween(this.node).to(0.25, {position: new Vec3(-ui.contentSize.x, 0)}, {
            easing: 'quadIn',
        })
            .call(() => {
                this.node.setPosition(-1200, 0);
            })
            .start();
    }

    show() {
        FarmApi.queryLeaderboard()
            .then(({data}) => {
                for (let child of this.content.children) {
                    if (child.active) {
                        child.destroy();
                    }
                }
                this.myRank.string = data.myRanking.toString();
                for (let v of data.farmRankingLists) {
                    const node = instantiate(this.item);
                    let label = node.getChildByName('Key').getComponent(Label);
                    label.string = v.id.toString();
                    label = node.getChildByName('Name').getComponent(Label);
                    label.string = v.userName;
                    label = node.getChildByName('Number').getComponent(Label);
                    label.string = v.income;
                    node.active = true;
                    this.content.addChild(node);
                }
            });
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


