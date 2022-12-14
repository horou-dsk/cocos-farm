import {
  _decorator,
  Component,
  Node,
  Vec3,
  Vec2,
  Sprite,
  tween,
  Label,
  Quat,
  isValid,
} from "cc";
import { AtalsLabel } from "db://assets/Scripts/ext/AtalsLabel";
import { Star } from "db://assets/Scripts/score/Star";
import { FarmApi } from "db://assets/Scripts/api";
const { ccclass, property } = _decorator;

// 二次贝塞尔曲线
function secondBezier(t: number, p0: Vec2, p1: Vec2, p2: Vec2) {
  const { x: x0, y: y0 } = p0;
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * x1 + t * t * x2;
  const y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * y1 + t * t * y2;
  return { x, y };
}

@ccclass("PlantEffect")
export class PlantEffect extends Component {
  public toNode: Node = null;

  private running = false;

  endPos = new Vec2(200, 220);

  p1 = new Vec2(420, 400);

  p0 = new Vec2(0, 0);

  t = 0;

  scale = new Vec2(0, 0);

  reverse = false;

  start() {
    // const pos = this.node.getWorldPosition();
    // this.p0 = new Vec2(pos.x, pos.y);
    // const nodeScale = this.node.getScale();
    // this.scale = new Vec2(nodeScale.x, nodeScale.y);
    // const sprite = this.node.getChildByName('1')?.getComponent(Sprite);
    // sprite.enabled = true;
  }

  reap() {
    if (!isValid(this)) return;
    // 终点坐标
    const toPos = this.toNode.getWorldPosition();
    // 起点坐标
    const selfPos = this.node.getWorldPosition();
    // 计算从起点到终点的向量
    const subResult = toPos.clone().subtract(selfPos).multiply3f(0.5, 0.5, 0);
    const c = Math.sqrt(subResult.x * subResult.x + subResult.y * subResult.y);
    // 计算二次贝塞尔曲线控制点坐标长度
    const moveLen = c / 2;
    // console.log(Math.asin(y / s));
    // const angle = Math.cos(subResult.x / c);
    // 计算垂直于 起点到终点的向量 方向的向量
    const vertical = subResult
      .clone()
      .cross(new Vec3(subResult.x, subResult.y, -1))
      .normalize();
    const newPos = subResult.add(selfPos);

    newPos.add(new Vec3(vertical.x * moveLen, vertical.y * moveLen, 0));
    const p0 = new Vec2(selfPos.x, selfPos.y);
    const p1 = new Vec2(newPos.x, newPos.y);
    const p2 = new Vec2(toPos.x, toPos.y);

    const selfRotate = this.node.getRotation();

    tween(this.node.getWorldScale())
      .to(0.4, new Vec3(0.2, 0.2, 0), {
        easing: "expoInOut",
        onUpdate: (target: Vec3, ratio: number) => {
          if (!isValid(this)) return;
          const result = secondBezier(ratio, p0, p1, p2);
          this.node.setWorldPosition(new Vec3(result.x, result.y, selfPos.z));
          this.node.setWorldScale(target);
          // console.log(Quat.fromEuler);
          Quat.fromEuler(selfRotate, 0, 0, ratio * 1440);
          this.node.setRotation(selfRotate);
        },
        onComplete: () => {
          const toNode = this.toNode;
          tween(toNode)
            .to(0.15, { scale: new Vec3(1.2, 1.2, 0) })
            .to(0.15, { scale: new Vec3(1, 1, 0) })
            .call(() => {
              FarmApi.MyLandData();
              // const star = toNode.getChildByName('num').getComponent(AtalsLabel);
              // console.log(star.str);
              // star.str = Number(star.str) + 1 + '';
              // label.string = Number(label.string) + 1 + '';
            })
            .start();
          this.node.destroy();
        },
      })
      .start();
  }

  update(deltaTime: number) {
    if (this.running) {
      if (!this.reverse) {
        this.t += 0.01;
      } else {
        this.t -= 0.01;
      }
      const scale = new Vec2(
        this.scale.x - this.t * 0.5,
        this.scale.y - this.t * 0.5
      );
      const result = secondBezier(this.t, this.p0, this.p1, this.endPos);
      this.node.setWorldPosition(
        new Vec3(result.x, result.y, this.node.getWorldPosition().z)
      );
      this.node.setScale(new Vec3(scale.x, scale.y, 1));
      if (this.t >= 1 || this.t <= 0) {
        this.reverse = !this.reverse;
      }
      // const rotation = this.node.eulerAngles;
      // this.node.setRotationFromEuler(new Vec3(0, rotation.y + 1, rotation.z + 1));
    }
  }
}
