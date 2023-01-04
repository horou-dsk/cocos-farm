import {
  _decorator,
  Component,
  Node,
  UITransform,
  Vec3,
  Vec2,
  tween,
  Label,
  instantiate,
} from "cc";
import { FarmApi } from "../../api";
import { CountDown } from "../../ext/CountDown";
import { createConfirm } from "../Confirm";
import { StealItem } from "./StealItem";
const { ccclass, property } = _decorator;

@ccclass("Steal")
export class Steal extends Component {
  @property(CountDown)
  coutdownLabel: CountDown;

  @property(Label)
  pickedLabel: Label;

  @property(Label)
  toPickLabel: Label;

  @property(Node)
  item: Node;

  @property(Node)
  content: Node;

  start() {
    this.item.active = false;
  }

  hide() {
    // this.node.setPosition(-1200, 0);
    const ui = this.node.getComponent(UITransform);
    tween(this.node)
      .to(
        0.25,
        { position: new Vec3(-ui.contentSize.x, 0) },
        {
          easing: "quadIn",
        }
      )
      .call(() => {
        this.node.setPosition(1200, 0);
      })
      .start();
  }

  show() {
    // alert('暂未开放');
    // return;
    this.updateList();
    const ui = this.node.getComponent(UITransform);
    const pos = new Vec2(0, -ui.contentSize.y);
    this.node.setPosition(0, -pos.y);

    tween(pos)
      .to(0.25, new Vec2(0, 0), {
        easing: "quadIn",
        onUpdate: (target: Vec2) => {
          this.node.setPosition(target.x, target.y);
        },
      })
      .start();
  }

  toPick(event) {
    event.target.getComponent(StealItem).toPick();
    this.hide();
  }

  updateList() {
    for (let child of this.content.children) {
      if (child.active) {
        child.destroy();
      }
    }
    FarmApi.getCanStealUsersInfo()
      .then(({ data }) => {
        for (let item of data.users) {
          const itemNode = instantiate(this.item);
          const stealItem = itemNode.getComponent(StealItem);
          stealItem.updateData(item);
          itemNode.active = true;
          this.content.addChild(itemNode);
        }
        this.coutdownLabel.endTime = data.nextRefreshTime;
        this.pickedLabel.string = data.hasSteal;
        this.toPickLabel.string = data.couldSteal;
        this.coutdownLabel.onEndTime = () => {
          this.updateList();
        };
      })
      .catch(async (err) => {
        const confirm = await createConfirm();
        confirm.content = err.message;
        confirm.confirm = () => {
          confirm.node.destroy();
          this.hide();
        };
        confirm.show();
      });
  }

  update() {}
}
