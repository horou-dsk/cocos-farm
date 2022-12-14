import {
  _decorator,
  Component,
  Node,
  UIRenderer,
  Color,
  Prefab,
  instantiate,
} from "cc";
import { PlantOpr } from "db://assets/Scripts/land/plant/PlantOpr";
import {
  PolygonButton,
  Transition,
} from "db://assets/Scripts/ext/PolygonButton";
import { Confirm } from "db://assets/Scripts/scenes/Confirm";
import { getParentByName } from "db://assets/Scripts/utils/utils";
import { FarmApi } from "db://assets/Scripts/api";
import { net } from "db://assets/Scripts/utils/net";
import { handleRequestError } from "../utils/request";
const { ccclass, property } = _decorator;

@ccclass("Land")
export class Land extends Component {
  @property(Prefab)
  confirm: Prefab;

  private _open = false;

  public canOpen = true;

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
    this.updateOpenColor();
  }

  @property(Node)
  sowingNode: Node;

  start() {
    this.updateOpenColor();
  }

  sowingShow() {
    if (!this.canOpen) return;
    const plant = this.node.getChildByName("plant");
    if (!plant && this.open) {
      this.sowingNode.getComponent(PlantOpr).show();
    }
    console.log(this.node.parent.name);
    if (!this.open) {
      const confirm = instantiate(this.confirm);
      const c = confirm.getComponent(Confirm);
      c.content = "是否要激活新土地？";
      c.confirm = () => {
        FarmApi.activeLand()
          .then(() => {
            net.send({ method: "SELF" });
          })
          .catch(handleRequestError);
        confirm.destroy();
      };
      getParentByName(this.node, "Canvas").addChild(confirm);
      // this.node.addChild(confirm);
    }
  }

  updateOpenColor() {
    const pb = this.node.getComponent(PolygonButton);
    pb.transition = Transition.None;
    const render = this.node.getComponent(UIRenderer);
    if (this.open) {
      render.color = Color.WHITE.clone();
    } else {
      render.color = new Color(255, 255, 255, 166);
    }
    // pb.disabled = !this.open;
  }

  update(deltaTime: number) {}
}
