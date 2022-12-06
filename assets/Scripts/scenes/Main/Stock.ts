import { _decorator, Component, Node } from 'cc';
import {AtalsLabel} from "db://assets/Scripts/ext/AtalsLabel";
const { ccclass, property } = _decorator;

@ccclass('StockItem')
class StockItem {
    @property
    id: number = 0;

    @property(AtalsLabel)
    label: AtalsLabel = null;
}
@ccclass('Stock')
export class Stock extends Component {

    @property(StockItem)
    item = [];

    start() {

    }

    update(deltaTime: number) {
        
    }
}


