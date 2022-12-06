import { _decorator, Component, Node, SpriteFrame, instantiate, Sprite, Label, Color, Button } from 'cc';
const { ccclass, property } = _decorator;
import * as i18n from 'db://i18n/LanguageData';
import {Item} from "db://assets/Scripts/scenes/Shop/Item";

@ccclass('PropsList')
export class PropsList extends Component {

    @property(Node)
    item: Node = null;

    @property(Node)
    content: Node = null;

    @property(SpriteFrame)
    farmerSp: SpriteFrame = null;
    @property(SpriteFrame)
    dogSp: SpriteFrame = null;
    @property(SpriteFrame)
    copcSp: SpriteFrame = null;
    @property(SpriteFrame)
    goldSp: SpriteFrame = null;

    propsSp: {id: number; sp: SpriteFrame; text: string; num?: string; desc?: string; name: string}[] = [];
    start() {
        this.item.active = false;
    }

    // purchaseMoneyType -> 1.金币 2.COPC
    public updateList(
        productList: { productId: number; price: string; produce: number; plantingCycle: number; canClick: 1 | 2; purchaseMoneyType: 1 | 2 }[]
    ) {

        const shop = i18n.t('shop');
        this.propsSp = [
            {
                id: 1,
                sp: this.farmerSp,
                text: shop.framer,
                desc: shop.framerDesc,
                name: shop.framerName,
            },
            {
                id: 2,
                sp: this.dogSp,
                text: shop.dog,
                desc: shop.dogDesc,
                name: shop.dogName,
            },
            {
                id: 3,
                sp: this.copcSp,
                text: shop.copc,
                num: '1',
                name: shop.copcName,
            },
            {
                id: 4,
                sp: this.goldSp,
                text: shop.gold,
                num: '1',
                name: shop.goldName,
            },
        ];
        for (let node of this.content.children) {
            if (node.active) {
                node.destroy();
            }
        }
        for (let product of productList) {
            const node = instantiate(this.item);
            const iconNode = node.getChildByName('Icon');
            const sprite = iconNode.getComponent(Sprite);
            const props = this.propsSp.find(v => v.id === product.productId);
            if (props.num) {
                const numNode = iconNode.getChildByName('Label');
                numNode.active = true;
                const numLabel = numNode.getComponent(Label);
                numLabel.string = props.num;
            }
            sprite.spriteFrame = props.sp;
            const label = node.getChildByPath('Title/Label').getComponent(Label);
            label.string = props.text;
            let coin: Node;
            if (product.purchaseMoneyType === 1) {
                coin = node.getChildByPath('Gold');
            } else {
                coin = node.getChildByName('Copc');
            }
            coin.active = true;
            const price = coin.getChildByName('Price').getComponent(Label);
            price.string = product.price;
            if (product.canClick === 2) {
                price.color = Color.RED;
                const button = node.getComponent(Button);
                button.enabled = false;
            }
            const item = node.getComponent(Item);
            item.productInfo = {
                id: product.productId,
                name: props.name,
                desc: props.desc,
                sp: props.sp,
                price: (props.id === 3 || props.id === 4) ? Number(product.price) : undefined,
            };
            node.active = true;
            this.content.addChild(node);
        }
    }

    update(deltaTime: number) {
        
    }
}


