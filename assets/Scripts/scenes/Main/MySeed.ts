import { _decorator, Component, Node } from 'cc';
import {AtalsLabel} from "db://assets/Scripts/ext/AtalsLabel";
import {RequestController, RequestMapping} from "db://assets/Scripts/utils/net";
const { ccclass, property } = _decorator;

@ccclass('SeedItem')
class SeedItem {
    @property
    id: number = 0;

    @property(AtalsLabel)
    label: AtalsLabel = null;
}

@ccclass('MySeed')
@RequestController
export class MySeed extends Component {

    @property(SeedItem)
    item: SeedItem[] = [];

    start() {

    }

    update(deltaTime: number) {
        
    }

    @RequestMapping('MY_DATA')
    updateSeedNum({assets}: {assets: Record<string, string>;}) {
        for (let item of this.item) {
            item.label.str = assets[item.id];
        }
    }

}


