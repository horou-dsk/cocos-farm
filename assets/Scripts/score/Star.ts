import { _decorator, Component, Node } from 'cc';
import {AtalsLabel} from "db://assets/Scripts/ext/AtalsLabel";
const { ccclass, property } = _decorator;

@ccclass('Star')
export class Star extends Component {

    private _num = 1999;

    get num() {
        return this._num;
    }

    set num(value: number) {
        this._num = value;
        const al = this.node.getComponent(AtalsLabel);
        al.str = value.toString() + 'K';
    }
}


