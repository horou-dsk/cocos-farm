
const win = window as any;

export const languages = {
    // Data
    shop: {
        seedIntro: '金幣產出 {0}\n' +
            '種植週（H) {1}',
        hav: '已擁有',
        buyTitle: '道具信息',
        framer: '農夫\n金幣產出 10%',
        dog: '田園犬\n守護農場，不被偷竊',
        copc: 'COPC\n生態數字資產',
        gold: '金幣\n使用copc'
    },
    steal: {
        autoRefresh: '自動刷新倒計時：',
        today: '今日以採摘:',
        todayCan: '還可以採摘:'
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zhHK = languages;
