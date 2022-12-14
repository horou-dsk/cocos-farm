import { _decorator, Component, Node, Label, instantiate, Sprite, Vec2, Vec3 } from 'cc';
import {Item, ProductInfo} from "db://assets/Scripts/scenes/Shop/Item";
import {FarmApi} from "db://assets/Scripts/api";
import { Shop } from './Shop';
import {Confirm, createConfirm} from "db://assets/Scripts/scenes/Confirm";
import { handleRequestError } from '../../utils/request';
const { ccclass, property } = _decorator;

@ccclass('BuyConfirm')
export class BuyConfirm extends Component {

    @property(Label)
    buyNumLabel: Label;

    @property(Label)
    title: Label;

    @property(Sprite)
    icon: Sprite;

    @property(Label)
    desc: Label;


    @property(Label)
    buyNumLabel1: Label;

    @property(Label)
    useGoldLabel: Label;

    @property(Label)
    useGoldNum: Label;

    @property(Label)
    havNumber: Label;

    @property(Node)
    numOpr: Node;

    @property(Node)
    buyBtnNode: Node;

    @property(Node)
    replaceBtnNode: Node;

    @property(Shop)
    shop: Shop;


    private _buyNumber = 1;

    private _productId: number | null = null;

    private _price: number;

    set buyNumber(val: number) {
        this._buyNumber = val;
        this.buyNumLabel.string = val.toString();
        this._updateAmount();
    }

    get buyNumber() {
        return this._buyNumber;
    }
    start() {
        this.buyNumber = 1;
    }

    addBuyNumber() {
        this.buyNumber += 1;
    }

    subBuyNumber() {
        if (this.buyNumber > 1) {
            this.buyNumber -= 1;
        }
    }

    hide() {
        this.node.destroy();
        // this.node.active = false;
        // this.node.setPosition(0, 620);
    }

    show(productInfo: ProductInfo) {
        // console.log(productInfo);
        this.icon.spriteFrame = productInfo.sp;
        this.title.string = productInfo.name;
        const oprPos = new Vec3(25, -57);
        this._productId = productInfo.id;
        if (productInfo.price) {
            this._price = productInfo.price;
            this.desc.node.active = false;
            this.buyNumLabel1.node.active = true;
            this.useGoldLabel.node.active = true;
            this.useGoldLabel.string = productInfo.useDesc;
            this.useGoldNum.node.active = true;
            this.numOpr.setPosition(oprPos);
            this._updateAmount();
            this.replaceBtnNode.active = true;
        } else {
            this.desc.string = productInfo.desc;
            this.buyBtnNode.active = true;
        }
        this.node.active = true;
        this.node.setPosition(0, 0);
    }

    create(event) {
        const item = event.target.getComponent(Item);
        const self = instantiate(this.node);
        self.getComponent(BuyConfirm).show(item.productInfo);
        this.node.parent.addChild(self);
    }

    _updateAmount() {
        if (!this._price) return;
        this.useGoldNum.string = this._price * this._buyNumber + '';
    }

    buy() {
        FarmApi.purchaseOrReplacement(this._productId, this._buyNumber).then((res) => {
            return createConfirm();
        }).then((confirm) => {
            confirm.content = '置换成功！';
            confirm.show();
            confirm.confirm = () => {
                confirm.node.destroy();
            }
            this.shop.updateStore();
            this.hide();
        }).catch(handleRequestError);
    }

    update(deltaTime: number) {
        
    }
}


