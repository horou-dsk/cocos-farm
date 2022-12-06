import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as i18n from 'db://i18n/LanguageData';
import {net} from "db://assets/Scripts/utils/net";
import {FarmApi} from "db://assets/Scripts/api";

@ccclass('Main')
export class Main extends Component {
    start() {
        net.send({
            method: 'SELF',
            // message: {
            //     userId: ''
            // }
        });
        net.connect();
        FarmApi.enterFarm().then(console.log);
    }

    update(deltaTime: number) {
        
    }

    changeLanguage() {
        console.log(i18n._language);
        if (i18n._language === 'zh') {
            i18n.init('en');
        } else {
            i18n.init('zh');
        }
        console.log(i18n.t('test'));
        i18n.updateSceneRenderers();
    }
}


