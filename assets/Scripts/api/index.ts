import request from "db://assets/Scripts/utils/request";
import {net} from "db://assets/Scripts/utils/net";

export namespace FarmApi {
    export function enterStore(productType: number) {
        return request.post('/enter/enterStore', {data: {productType}});
    }

    export function seedStock(productId: number) {
        return request.post('/enter/seedStock', {data: {productId}});
    }

    export function queryLeaderboard() {
        return request.get('/enter/queryLeaderboard');
    }

    export enum AssetsType {
        Gold = 1,
        Beans,
        White,
        Corn
    }

    export function plant(type: AssetsType, landNum: number) {
        return request.post('/enter/plant', {data: {assetsType: type, landNum}});
    }

    export enum ProductType {
        Farm = 1,
        Dog,
        Copc,
        Gold,
        Beans,
        White,
        Corn,
    }

    export function purchaseOrReplacement(
        productId: ProductType,
        count: number,
        // balance: number,
    ) {
        return request.post('/enter/purchaseOrReplacement', {
            data: {
                productId,
                count,
                // balance,
            }
        });
    }

    export function enterFarm() {
        return request.get('/enter/enterFarm');
    }

    export function activeLand() {
        return request.get('/enter/activeLand');
    }

    export function MyLandData() {
        net.send({method: 'SELF'});
    }

    export function pick(id: number) {
        return request.post('/farm/pick', {data: {plantRecordId: id}});
    }

    export type MyData = {
        assets: Record<string, any>;
        lands: {
            landRecords: {
                "plantId": number; // 种子类型id  1.小麦 2.白菜 3.玉米  4.西兰花
                "plantRecordId": number; // 土地当前种植记录id
                "plantStatus": number; // 土地当前状态
                "landStatus": number; // 土地状态  1.空闲中 2.种植中
                "landNum": number; // 土地编号
                "nexChangeTime": number; // 下次状态变更时间
            }[];
        }
    };

    export type LandData = {
        "plantId": number; // 种子类型id  1.小麦 2.白菜 3.玉米  4.西兰花"
        "plantRecordId": number, // 种植记录id
        "nexChangeTime": number, //  下次变更时间
        "userId": number,  // 用户id
        "landNum": number, // 土地编号
        "status": number // 当前状态
    }
}