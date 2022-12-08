import { _decorator, Component, Node, Label, instantiate, Vec3, resources, Prefab, director } from 'cc';
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
        this.node.setPosition(new Vec3(0, 0, 0));
    }

    confirm() {}

    close() {
        this.node.destroy();
    }
}

export function createConfirm(): Promise<Confirm> {
    return new Promise((resolve, reject) => {
        resources.load('Prefab/Main/Confirm', Prefab, (err, prefab) => {
            if (err) {
                return reject(err);
            }
            const node: Node = instantiate(prefab);
            director.getScene().getChildByName('Canvas').addChild(node);
            resolve(node.getComponent(Confirm));
        });
    });
}
