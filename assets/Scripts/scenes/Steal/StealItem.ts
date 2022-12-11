import { _decorator, Component, Node, Label } from 'cc';
import { FarmApi } from '../../api';
import { eventEmitter } from '../../utils/net';
const { ccclass, property } = _decorator;

@ccclass('StealItem')
export class StealItem extends Component {

    @property(Label)
    nickname: Label;

    @property(Node)
    steal: Node;

    private _userId = 0;

    public updateData({nickname, id}: {nickname: string; id: number}) {
        this.nickname.string = nickname;
        this._userId = id;
    }

    public toPick() {
        FarmApi.enterOtherFarm(this._userId).then(() => {
            FarmApi.OtherLandData(this._userId);
        });
        eventEmitter.emit('focusSteal', this._userId);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


