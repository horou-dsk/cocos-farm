import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;
import * as i18n from 'db://i18n/LanguageData';
import {LocalizedSprite} from "db://i18n/LocalizedSprite";

@ccclass('LocalizedShopTabSpriteItem')
class LocalizedShopTabSpriteItem {
    @property
    language: string = 'zh';
    @property({
        type: SpriteFrame,
    })
    spriteFrame: SpriteFrame | null = null;
}

@ccclass('LocaleShopTab')
export class LocaleShopTab extends Component {

    @property(LocalizedShopTabSpriteItem)
    activeSpriteList: LocalizedShopTabSpriteItem[] = [];

    private _active = false;

    set active(val: boolean) {
        this._active = val;
        this.updateActiveState();
    }

    get active() {
        return this._active;
    }

    private updateActiveState() {
        const sprite = this.node.getComponent(Sprite);
        if (this.active) {
            const sp = this.activeSpriteList.find(v => v.language === i18n._language);
            sprite.spriteFrame = sp.spriteFrame;
        } else {
            const lp = this.node.getComponent(LocalizedSprite);
            const sp = lp.spriteList.find(v => v.language === i18n._language);
            sprite.spriteFrame = sp.spriteFrame;
        }
    }

    start() {
        // this.updateActiveState();
    }

    update(deltaTime: number) {
        
    }
}


