import {_decorator, Component, Node, SpriteFrame, instantiate, Sprite, Label, Color, Button} from 'cc';

const {ccclass, property} = _decorator;
import * as i18n from 'db://i18n/LanguageData';
import {strFormat} from "db://assets/Scripts/utils/utils";
import {Item} from "db://assets/Scripts/scenes/Shop/Item";

@ccclass('SeedList')
export class SeedList extends Component {

    @property(Node)
    item: Node = null;

    @property(Node)
    content: Node = null;

    // 玉米精灵图
    @property(SpriteFrame)
    cornSpriteFrame: SpriteFrame = null;
    // 豆子精灵图
    @property(SpriteFrame)
    beansSpriteFrame: SpriteFrame = null;
    // 莲白精灵图
    @property(SpriteFrame)
    whiteSpriteFrame: SpriteFrame = null;

    seedsSp: { id: number; sp: SpriteFrame; name: string }[] = [];

    start() {
        this.item.active = false;

    }

    // canClick : 1 可点击 2 不可点击
    updateList(productList: { productId: number; price: string; produce: number; plantingCycle: number; canClick: 1 | 2 }[]) {
        for (let node of this.content.children) {
            if (node.active) {
                node.destroy();
            }
        }
        const shop = i18n.t('shop');
        this.seedsSp = [
            {
                id: 7,
                sp: this.cornSpriteFrame,
                name: shop.corn,
            },
            {
                id: 5,
                sp: this.beansSpriteFrame,
                name: shop.beans,
            },
            {
                id: 6,
                sp: this.whiteSpriteFrame,
                name: shop.white,
            }
        ];
        for (let product of productList) {
            const node = instantiate(this.item);
            const sprite = node.getChildByName('SeedIcon').getComponent(Sprite);
            const seed = this.seedsSp.find(v => v.id === product.productId);
            sprite.spriteFrame = seed.sp;
            const label = node.getChildByPath('Head/Title').getComponent(Label);
            label.string = strFormat(shop.seedIntro, product.produce, product.plantingCycle);
            const coin = node.getChildByPath('Footer/Price').getComponent(Label);
            coin.string = product.price;
            const item = node.getComponent(Item);
            item.productInfo = {
                id: product.productId,
                name: seed.name,
                sp: sprite.spriteFrame,
                desc: label.string,
            };
            if (product.canClick === 2) {
                coin.color = Color.RED;
                node.getComponent(Button).enabled = false;
            }
            node.active = true;
            this.content.addChild(node);
        }
        // this.item.destroy();
    }

    update(deltaTime: number) {

    }
}


