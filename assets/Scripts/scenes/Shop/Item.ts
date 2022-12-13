import { _decorator, Component, Node, SpriteFrame } from 'cc';
import {FarmApi} from "db://assets/Scripts/api";
type ProductType = FarmApi.ProductType;
const { ccclass, property } = _decorator;

export type ProductInfo = {
    id: ProductType;
    name: string;
    sp: SpriteFrame;
    desc?: string;
    price?: number; // 单价
    useDesc?: string;
};

@ccclass('Item')
export class Item extends Component {

    public productInfo: ProductInfo = null;

    start() {}

    update() {}
}


