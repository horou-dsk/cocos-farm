import { _decorator, Component, Node } from 'cc';
import {PlantOpr} from "db://assets/Scripts/land/plant/PlantOpr";
import {AtalsLabel} from "db://assets/Scripts/ext/AtalsLabel";
import {RequestController, RequestMapping} from "db://assets/Scripts/utils/net";
import {FarmApi} from "db://assets/Scripts/api";
const { ccclass, property } = _decorator;

@ccclass('Sowing')
@RequestController
export class Sowing extends Component {
    @property(AtalsLabel)
    whiteLabel: AtalsLabel = null;
    @property(AtalsLabel)
    cornLabel: AtalsLabel = null;
    @property(AtalsLabel)
    beansLabel: AtalsLabel = null;

    private _label: {id: number; label: AtalsLabel}[] = [];

    public landNum = 0;

    start() {
    }

    sowing(_event, type: string) {
        console.log(type);
        FarmApi.plant(Number(type), this.landNum).then(() => {
            FarmApi.MyLandData();
        });
        const po = this.getComponent(PlantOpr);
        po.hide();
    }

    update(deltaTime: number) {
        
    }

    @RequestMapping('MY_DATA')
    updateMyData({assets}: FarmApi.MyData) {
        this._label = [
            {
                id: 2,
                label: this.beansLabel,
            },
            {
                id: 3,
                label: this.whiteLabel,
            },
            {
                id: 4,
                label: this.cornLabel,
            },
        ];
        for (let item of this._label) {
            item.label.str = assets[item.id];
        }
    }
}


