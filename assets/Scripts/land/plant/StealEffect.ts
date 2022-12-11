import { _decorator, Component, Node, tween, Vec3, Label, instantiate, Sprite, SpriteFrame, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StealEffect')
export class StealEffect extends Component {

    @property(Node)
    label: Node;

    @property(Node)
    sprite: Node;

    // 玉米
    @property(SpriteFrame)
    cornSp: SpriteFrame;

    // 豆子
    @property(SpriteFrame)
    beansSp: SpriteFrame;

    // 白菜
    @property(SpriteFrame)
    whiteSp: SpriteFrame;

    private getPlantWithType(type: number) {
        switch(type) {
            case 1:
                return this.beansSp;
            case 2:
                return this.whiteSp;
            case 3:
                return this.whiteSp;
        }
    }

    public plantType = 1;

    public stealNum = 0;

    start() {
        // this.show();
    }

    show() {
        const cloneLabel = instantiate(this.label);
        cloneLabel.active = true;
        this.node.addChild(cloneLabel);
        const labelPos = cloneLabel.getPosition();
        const label = cloneLabel.getComponent(Label);
        label.string = '+ ' + this.stealNum;
        tween(cloneLabel).to(1, {
            position: new Vec3(labelPos.x, labelPos.y + 150, labelPos.z),
            scale: new Vec3(3, 3),
        }, {
            onUpdate(_t, ratio) {
                const color = label.color.clone();
                color.a = Math.floor((1 - ratio) * 255);
                label.color = color;
            }
        })
        .call(() => {
            cloneLabel.destroy();
        })
        .start();
        const cloneSprite = instantiate(this.sprite);
        cloneSprite.active = true;
        const spritePos = cloneSprite.getPosition();
        const spriteComp = cloneSprite.getComponent(Sprite);
        spriteComp.spriteFrame = this.getPlantWithType(this.plantType);
        this.node.addChild(cloneSprite);
        tween(cloneSprite).to(1, {
            position: new Vec3(spritePos.x, spritePos.y + 80, spritePos.z),
        }, {
            onUpdate(_, ratio) {
                const color = spriteComp.color.clone();
                color.a = Math.floor((1 - ratio) * 255);
                spriteComp.color = color;
            }
        })
        .call(() => {
            cloneSprite.destroy();
        }).start();
    }

    update(deltaTime: number) {
        
    }
}


