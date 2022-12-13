import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as i18n from 'db://i18n/LanguageData';
import {net} from "db://assets/Scripts/utils/net";
import {FarmApi} from "db://assets/Scripts/api";
import { handleRequestError } from '../../utils/request';

@ccclass('Main')
export class Main extends Component {
    start() {
        FarmApi.enterFarm().then(res => {
            if (res.status == '200') {
                net.send({
                    method: 'SELF',
                    // message: {
                    //     userId: ''
                    // }
                });
                net.connect();
            }
        }).catch(handleRequestError);
        // this.schedule(function() {
        //     FarmApi.MyLandData();
        // }, 3);
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


