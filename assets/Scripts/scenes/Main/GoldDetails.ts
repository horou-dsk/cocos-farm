import {
  _decorator,
  Component,
  Node,
  SpriteFrame,
  instantiate,
  Label,
  Sprite,
  Color,
  ScrollBar,
  ScrollView,
} from "cc";
import { FarmApi } from "../../api";
import { handleRequestError } from "../../utils/request";
const { ccclass, property } = _decorator;
import dayjs from "dayjs";

@ccclass("GoldDetails")
export class GoldDetails extends Component {
  @property(SpriteFrame)
  one: SpriteFrame;

  @property(SpriteFrame)
  two: SpriteFrame;

  @property(Node)
  container: Node;

  @property(Node)
  item: Node;

  @property(ScrollBar)
  scrollBar: ScrollBar;

  @property(ScrollView)
  scrollView: ScrollView;

  private page = 1;

  start() {
    this.item.active = false;
    this.scrollView.node.on("scroll-to-bottom", this.onBottom, this);
  }

  onDestroy() {
    this.scrollView.node.off("scroll-to-bottom", this.onBottom, this);
  }

  onBottom() {
    this.page += 1;
    this.loadList();
  }

  hide() {
    this.node.setPosition(1200, 0);
  }

  show() {
    this.page = 1;
    this.node.setPosition(0, 0);
    for (let child of this.container.children) {
      if (child.active) {
        child.destroy();
      }
    }
    this.loadList();
  }

  loadList() {
    FarmApi.getFarmAssets(this.page)
      .then(({ data }) => {
        for (let i in data.list) {
          const v = data.list[i];
          const item = instantiate(this.item);
          item.getComponent(Sprite).spriteFrame =
            Number(i) % 2 == 0 ? this.one : this.two;
          const label1 = item.getChildByName("Time").getComponent(Label);
          label1.string = dayjs(v.createTime).format("YYYY-MM-DD HH:mm:ss");
          const label2 = item.getChildByName("Type").getComponent(Label);
          label2.string = v.changeTypeStr;
          const label3 = item.getChildByName("Num").getComponent(Label);
          label3.string = v.changeAmountStr;
          const label4 = item.getChildByName("Balance").getComponent(Label);
          label4.string = v.balanceStr;
          if (Number(i) % 2 == 1) {
            label1.color = new Color("#B9783C");
            label2.color = new Color("#743B06");
            label3.color = new Color("#743B06");
            label4.color = new Color("#743B06");
          }
          item.active = true;
          this.container.addChild(item);
        }
        // @ts-ignore
        this.scrollBar._opacity = 255;
        this.scrollBar.show();
      })
      .catch(handleRequestError);
  }

  update(deltaTime: number) {}
}
