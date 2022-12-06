import { _decorator, Component, Node } from 'cc';
import {AtalsLabel} from "db://assets/Scripts/ext/AtalsLabel";
const { ccclass, property } = _decorator;

@ccclass('SeedNum')
export class SeedNum extends Component {

    @property(AtalsLabel)
    cornLabel: AtalsLabel = null;
    @property(AtalsLabel)
    beansLabel: AtalsLabel = null;
    @property(AtalsLabel)
    whiteLabel: AtalsLabel = null;
    @property(AtalsLabel)
    goldLabel: AtalsLabel = null;
    @property(AtalsLabel)
    copcLabel: AtalsLabel = null;

    private _labels: {id: string; label: AtalsLabel}[] = [];


    start() {
        this._labels = [
            {
                id: '-1',
                label: this.copcLabel,
            },
            {
                id: '2',
                label: this.beansLabel,
            },
            {
                id: '3',
                label: this.whiteLabel,
            },
            {
                id: '4',
                label: this.cornLabel,
            },
            {
                id: '1',
                label: this.goldLabel,
            },
        ]
    }

    updateNum(assets: Record<string, string>) {
        for (let l of this._labels) {
            l.label.str = assets[l.id];
        }
    }

    update(deltaTime: number) {
        
    }
}


