
const win = window as any;

export const languages = {
    // Data
    shop: {
        seedIntro: 'Gold coin output {0}\n' +
            'Planting Week (H) {1}',
        hav: 'Already Owned',
        buyTitle: 'Prop Information',
        framer: 'Farmer\ngold coin output 10%',
        dog: 'Pastoral dog\nGuard the farm from being stolen',
        copc: 'COPC\nEcological Digital Assets',
        gold: 'Gold coins\nuser copc',
    },
    steal: {
        autoRefresh: 'Auto Refresh Countdown：',
        today: 'Picking today:',
        todayCan: 'Can picked:'
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
