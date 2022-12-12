import { _decorator, Component, Node, CCString } from 'cc';
import { FarmApi } from '../../api';
import { RequestController, RequestMapping } from '../../utils/net';
const { ccclass, property } = _decorator;

@ccclass('UserAssetsItem')
class UserAssetsItem {
    @property
    id: string = '';

    @property(Node)
    itemNode: Node = null;
}

@ccclass('UserFarm')
@RequestController
export class UserFarm extends Component {

    @property(UserAssetsItem)
    farmer: UserAssetsItem;

    @property(UserAssetsItem)
    dog: UserAssetsItem;

    start() {

    }

    update(deltaTime: number) {
        
    }

    updateFarmerAndDog(assets: FarmApi.MyData['assets']) {
        this.dog.itemNode.active = false;
        for (let key in assets) {
            if (key === this.farmer.id) {
                if (Number(assets[key])) {
                    this.farmer.itemNode.active = true;
                } else {
                    this.farmer.itemNode.active = false;
                }
            }
            if (key === this.dog.id) {
                if (Number(assets[key])) {
                    this.dog.itemNode.active = true;
                } else {
                    this.dog.itemNode.active = false;
                }
            }
        }
    }

    @RequestMapping('MY_DATA')
    myLandData({assets}: FarmApi.MyData) {
        console.log(assets);
        this.updateFarmerAndDog(assets);
    }

    @RequestMapping('OTHER_DATA')
    otherLandData({assets}: FarmApi.MyData) {
        this.updateFarmerAndDog(assets);
    }
}


