import { _decorator, Component, Node, UITransform, tween, Vec2, Vec3 } from 'cc';
import {LocaleShopTab} from "db://assets/Scripts/scenes/Main/LocaleShopTab";
import {SeedList} from "db://assets/Scripts/scenes/Shop/SeedList";
import {FarmApi} from "db://assets/Scripts/api";
import {PropsList} from "db://assets/Scripts/scenes/Shop/PropsList";
import {SeedNum} from "db://assets/Scripts/scenes/Shop/SeedNum";
const { ccclass, property } = _decorator;

enum GoodsType {
    Seed,
    Props
}

@ccclass('Shop')
export class Shop extends Component {

    @property(Node)
    copcNumNode: Node = null;

    @property(SeedNum)
    seedNum: SeedNum = null;

    @property(Node)
    seedList: Node = null;

    @property(Node)
    propsList: Node = null;

    @property(LocaleShopTab)
    seedBtn: LocaleShopTab = null;

    @property(LocaleShopTab)
    propsBtn: LocaleShopTab = null;

    private _type: GoodsType = GoodsType.Seed;

    start() {
        this._switchList(GoodsType.Seed);
    }

    private _switchList(type: GoodsType) {
        this._type = type;
        if (this._type === GoodsType.Seed) {
            this.seedList.active = true;
            this.seedBtn.active = true;
            this.propsList.active = false;
            this.propsBtn.active = false;
            this.copcNumNode.active = false;
        } else {
            this.propsList.active = true;
            this.propsBtn.active = true;
            this.seedList.active = false;
            this.seedBtn.active = false;
            this.copcNumNode.active = true;
        }
        this.updateStore();
    }

    updateStore() {
        const _type = this._type;
        // 获取商店种子数据
        FarmApi.enterStore(this._type + 1)
            .then(({data}) => {
                this.seedNum.updateNum(data.assets);
                if (_type === GoodsType.Seed) {
                    const seed = this.seedList.getComponent(SeedList);
                    seed.updateList(data.productList);
                } else {
                    const props = this.propsList.getComponent(PropsList);
                    props.updateList(data.productList);
                }
            });
    }

    switchList(_event, ty: string) {
        this._switchList(Number(ty));
    }

    hide() {
        // this.node.setPosition(-1200, 0);
        const ui = this.node.getComponent(UITransform);
        tween(this.node).to(0.25, {position: new Vec3(-ui.contentSize.x, 0)}, {
            easing: 'quadIn',
        })
            .call(() => {
                this.node.setPosition(-1200, 0);
            })
            .start();
    }

    show() {
        // 显示商店页面时，处理商店页TAB状态精灵显示问题
        this._switchList(this._type);
        const ui = this.node.getComponent(UITransform);
        const pos = new Vec2(0, -ui.contentSize.y);
        this.node.setPosition(0, -pos.y);

        tween(pos).to(0.25, new Vec2(0, 0), {
            easing: 'quadIn',
            onUpdate: (target: Vec2) => {
                this.node.setPosition(target.x, target.y);
            }
        }).start();
    }

    update(deltaTime: number) {
    }
}


