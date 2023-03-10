import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  Vec3,
  Button,
} from "cc";
import {
  RequestController,
  RequestMapping,
} from "db://assets/Scripts/utils/net";
import { FarmApi } from "db://assets/Scripts/api";
import { PolygonButton } from "db://assets/Scripts/ext/PolygonButton";
import { PlantEffect } from "db://assets/Scripts/land/plant/PlantEffect";
import { Land } from "db://assets/Scripts/land/Land";
import { Sowing } from "db://assets/Scripts/land/Sowing";
import { Reap } from "db://assets/Scripts/land/Reap";
import { CountDown } from "db://assets/Scripts/ext/CountDown";
import { createConfirm } from "db://assets/Scripts/scenes/Confirm";
import { StealPick } from "./StealPick";
import { OprType, PlantOpr } from "./plant/PlantOpr";

const { ccclass, property } = _decorator;

@ccclass("Lands")
@RequestController
export class Lands extends Component {
  @property(Prefab)
  land: Prefab;

  @property(Prefab)
  plant: Prefab;

  @property(Node)
  reapToNode: Node;

  @property(Node)
  topNode: Node;

  private plantType = {
    1: "豆子",
    2: "莲白",
    3: "玉米",
  };

  start() {
    this.refreshLands();
  }

  onDestroy() {
    console.log("lands destroy?????");
  }

  private refreshLands() {
    const children = this.node.children;
    const landMap: { [key: string]: Node } = {};
    for (let child of children) {
      if (child.active) {
        const oldLand = child.getChildByName("land");
        oldLand?.destroy();
        const land = instantiate(this.land); // child.getChildByName('land');// instantiate(this.land);
        const sowing = land.getChildByName("sowing").getComponent(Sowing);
        sowing.landNum = Number(child.name);
        const pb = land.getComponent(PolygonButton);
        pb.topNode = this.topNode;
        child.addChild(land);
        landMap[child.name] = land;
      }
    }
    return landMap;
  }

  update(deltaTime: number) {}

  @RequestMapping("MY_DATA")
  updateData({ lands }: FarmApi.MyData) {
    console.log(lands);
    const landMap = this.refreshLands();
    const plantType = this.plantType;
    if (lands.landRecords && lands.landRecords.length) {
      for (let child of this.node.children) {
        if (child.active) {
          const landNode = landMap[child.name];
          const oldPlant = landNode.getChildByName("plant");
          const eradicate = landNode.getChildByName("eradicate");
          if (eradicate.active) {
            eradicate.active = false;
          }
          oldPlant?.destroy();
          const land = landNode.getComponent(Land);
          land.canOpen = true;
          const record = lands.landRecords.find(
            (v) => v.landNum === Number(child.name)
          );
          if (!record) {
            land.open = false;
            continue;
          }
          land.open = true;
          if (record.landStatus === 2) {
            if (record.plantStatus === 6) {
              //   eradicate.active = true;
              continue;
            }
            const plant = instantiate(this.plant);
            landNode.insertChild(plant, 0);
            const crop = plant.getChildByName(plantType[record.plantId]);
            const status = record.plantStatus === 4 ? 5 : record.plantStatus;
            const cropStatusNode = crop.getChildByName(status.toString());
            cropStatusNode.active = true;
            const reap = plant.getComponent(Reap);
            reap.plantRecordId = record.plantRecordId;
            reap.canReap = record.plantStatus >= 4;
            const pe = plant.getComponent(PlantEffect);
            pe.toNode = this.reapToNode;

            // 倒计时
            const countdown = landNode
              .getChildByName("countdown")
              .getComponent(CountDown);
            countdown.endTime = record.nexChangeTime;
          }
        }
      }
    }
  }

  @RequestMapping("LAND")
  landUpdate(data: FarmApi.LandData) {
    console.log(data);
    const child = this.node.getChildByName(data.landNum.toString());
    const landNode = child.getChildByName("land");
    const oldPlant = landNode.getChildByName("plant");
    oldPlant?.destroy();
    const eradicate = landNode.getChildByName("eradicate");
    if (eradicate.active) {
      eradicate.active = false;
    }
    const land = landNode.getComponent(Land);
    land.canOpen = true;
    land.open = true;
    const plant = instantiate(this.plant);
    landNode.insertChild(plant, 0);
    const crop = plant.getChildByName(this.plantType[data.plantId]);
    const status = data.status === 4 ? 5 : data.status;
    const cropStatusNode = crop.getChildByName(status.toString());
    cropStatusNode.active = true;
    // 收取组件初始化
    const reap = plant.getComponent(Reap);
    reap.plantRecordId = data.plantRecordId;
    reap.canReap = data.status >= 4;

    const pe = plant.getComponent(PlantEffect);
    pe.toNode = this.reapToNode;

    // 倒计时
    const countdown = landNode
      .getChildByName("countdown")
      .getComponent(CountDown);
    countdown.endTime = data.nexChangeTime;
  }

  reapAll() {
    createConfirm().then((confirm) => {
      confirm.content = "是否收取所有可收取的植物？";
      confirm.show();
      confirm.confirm = () => {
        confirm.node.destroy();
        for (let child of this.node.children) {
          const land = child.getChildByName("land");
          const plant = land.getChildByName("plant");
          if (plant) {
            plant.getComponent(Reap).reap();
          }
        }
      };
    });
  }

  @RequestMapping("OTHER_DATA")
  otherLandUpdate({ lands }: FarmApi.MyData) {
    console.log(lands);
    const landMap = this.refreshLands();
    const plantType = this.plantType;
    if (lands.landRecords && lands.landRecords.length) {
      for (let child of this.node.children) {
        if (child.active) {
          const landNode = landMap[child.name];
          const oldPlant = landNode.getChildByName("plant");
          const eradicate = landNode.getChildByName("eradicate");
          if (eradicate.active) {
            eradicate.active = false;
          }
          oldPlant?.destroy();
          const land = landNode.getComponent(Land);
          land.canOpen = false;
          const record = lands.landRecords.find(
            (v) => v.landNum === Number(child.name)
          );
          if (!record) {
            land.open = false;
            continue;
          }
          land.open = true;
          if (record.landStatus === 2) {
            if (record.plantStatus === 6) {
              //   eradicate.active = true;
              continue;
            }
            const plant = instantiate(this.plant);
            landNode.insertChild(plant, 0);
            const crop = plant.getChildByName(plantType[record.plantId]);
            const status = record.plantStatus === 4 ? 5 : record.plantStatus;
            const cropStatusNode = crop.getChildByName(status.toString());
            cropStatusNode.active = true;

            // 状态为4时不能偷取
            if (record.plantStatus === 4) {
              cropStatusNode.getComponent(Button).enabled = false;
            }

            plant
              .getChildByName("plant_opr")
              .getComponent(PlantOpr)
              .setOprType(OprType.Steal);

            const stealPick = plant.getComponent(StealPick);

            stealPick.plantRecordId = record.plantRecordId;
            stealPick.plantId = record.plantId;
            // reap.canReap = record.plantStatus >= 4;
            const pe = plant.getComponent(PlantEffect);
            pe.toNode = this.reapToNode;
          }

          // 倒计时
          const countdown = landNode
            .getChildByName("countdown")
            .getComponent(CountDown);
          countdown.endTime = record.nexChangeTime;
        }
      }
    }
  }
}
