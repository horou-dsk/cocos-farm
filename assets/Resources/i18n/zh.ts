
const win = window as any;

export const languages = {
    test: {
        main: '测试',
        hello: '你好',
    },
    shop: {
        seedIntro: '金币产出 {0}\n种植周（H) {1}',
        hav: '已拥有',
        buyTitle: '道具信息',
        framer: '农夫\n金币产出 10%',
        dog: '田园犬\n守护农场，不被偷窃',
        copc: 'COPC\n生态数字资产',
        gold: '金币\n使用copc',
        framerDesc: '金币产出 10%',
        dogDesc: '守护农场，不被偷窃',
        buyNum: '购买数量：',
        useCoin: '消耗金币：',
        framerName: '农名',
        dogName: '田园犬',
        copcName: 'COPC',
        goldName: '金币',
        beans: '豆子',
        corn: '玉米',
        white: '白菜'
    },
    steal: {
        autoRefresh: '自动刷新倒计时：',
        today: '今日已采摘:',
        todayCan: '还可采摘:',
    }
    // Data
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh = languages;
