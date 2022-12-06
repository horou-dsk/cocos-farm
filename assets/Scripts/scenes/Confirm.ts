import { _decorator, Component, Node, Label, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Confirm')
export class Confirm extends Component {
    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
        this.contentLabel.string = value;
    }

    @property(Label)
    contentLabel: Label;

    private _content = '';

    start() {

    }

    update(deltaTime: number) {
        
    }

    show() {
        const node = instantiate(this.node);
        node.setPosition(new Vec3(0, 0, 0));
        this.node.parent.addChild(node);
    }

    confirm() {}

    close() {
        this.node.destroy();
    }
}


