import { _decorator, Component, Node } from 'cc';
import {PlantOpr} from "db://assets/Scripts/land/plant/PlantOpr";
import {PlantEffect} from "db://assets/Scripts/land/plant/PlantEffect";
import {FarmApi} from "db://assets/Scripts/api";
const { ccclass, property } = _decorator;

@ccclass('Reap')
export class Reap extends Component {

    public plantRecordId = 0;
    start() {

    }

    update(deltaTime: number) {
        
    }

    reap() {
        const po = this.node.getChildByName('plant_opr').getComponent(PlantOpr);
        po.hide();
        const pe = this.getComponent(PlantEffect);
        FarmApi.pick(this.plantRecordId).then(() => {
            pe.reap();
        });
    }
}


