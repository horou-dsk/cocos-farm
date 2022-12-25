import { _decorator, Component, Label } from "cc";
const { ccclass } = _decorator;

@ccclass("CountDown")
export class CountDown extends Component {
  private _running = false;
  get endTime(): number {
    return this._endTime;
  }

  set endTime(value: number) {
    if (value) {
      this._endTime = value * 1000;
      if (this._endTime > Date.now()) {
        this.node.active = true;
        this._running = true;
      }
    } else {
      this._endTime = null;
    }
  }

  private _endTime = 0;

  private _label: Label;
  start() {
    this._label = this.node.getComponent(Label);
  }

  public onEndTime() {}

  update(_deltaTime: number) {
    if (!this._running || !this._label) return;
    if (!this._endTime) {
      if (this._running) {
        this.onEndTime?.();
      }
      this._running = false;
    }
    const diff = Math.floor(this._endTime - Date.now());
    if (diff <= 0) {
      this._running = false;
      this.node.active = false;
    } else {
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor(diff / 1000 / 60) % 60;
      const seconds = Math.floor(diff / 1000) % 60;
      // const millis = diff % 1000;
      this._label.string = `${hours}h ${minutes}m ${seconds}s`;
    }
  }
}
