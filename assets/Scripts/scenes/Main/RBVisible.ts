import { _decorator, Component, Node } from "cc";
import { FarmApi } from "../../api";
import { eventEmitter } from "../../utils/net";
import { Steal } from "../Steal/Steal";
const { ccclass, property } = _decorator;

@ccclass("RBVisible")
export class RBVisible extends Component {
  @property(Node)
  b1: Node;
  @property(Node)
  b2: Node;
  @property(Node)
  b3: Node;
  @property(Node)
  b4: Node;
  @property(Node)
  b5: Node;
  @property(Node)
  seed: Node;
  @property(Steal)
  steal: Steal;

  private userId = 0;

  start() {
    eventEmitter.on("focusSteal", this.onFocusSteal);
    eventEmitter.on("blurSteal", this.onBlurSteal);
  }

  onBlurSteal = () => {
    // this.b1.active = true;
    this.b3.active = true;
    this.b4.active = true;
    this.b5.active = false;
    this.seed.active = true;
  };

  onFocusSteal = (userId: number) => {
    console.log(userId);
    this.userId = userId;
    // this.b1.active = false;
    this.b3.active = false;
    this.b4.active = false;
    this.b5.active = true;
    this.seed.active = false;
  };

  blurSteal() {
    eventEmitter.emit("blurSteal");
    FarmApi.outOtherFarm(this.userId).then(() => FarmApi.MyLandData());
  }

  backStealList() {
    this.steal.show();
    this.blurSteal();
  }

  onDestroy() {
    eventEmitter.off("focusSteal");
    eventEmitter.off("blurSteal");
  }

  update(deltaTime: number) {}
}
