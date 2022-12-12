import { _decorator, Component, Node } from 'cc';
import { FarmApi } from '../api';
import { handleRequestError } from '../utils/request';
import { PlantOpr } from './plant/PlantOpr';
import { StealEffect } from './plant/StealEffect';
import {createConfirm} from "db://assets/Scripts/scenes/Confirm";
const { ccclass, property } = _decorator;

@ccclass('StealPick')
export class StealPick extends Component {

    @property(StealEffect)
    ste: StealEffect;

    public plantRecordId = 0;

    public plantId = 1;

    start() {

    }

    steal() {
        const po = this.node.getChildByName('plant_opr').getComponent(PlantOpr);
        po.hide();
        const ste = this.ste;
        ste.plantType = this.plantId;
        FarmApi.steal(this.plantRecordId)
            .then(({data}) => {
                ste.stealNum = data.stealAmount;
                ste.show();
                return createConfirm();
            }).then(confirm => {
                confirm.content="采摘成功，奖励"+ste.stealNum+"个金币";
                confirm.show();
            }).catch(handleRequestError);


    }

    update(deltaTime: number) {
        
    }
}


