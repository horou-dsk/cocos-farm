
const win = window as any;

export const languages = {
    // Data
    shop: {
        seedIntro: '금화 출력 {0}\n' +
            '파종 주간(H) {1}',
        hav: '이미 소유',
        buyTitle: '소품 정보',
        framer: '농부\n금화 생산량 10%',
        dog: '목가의 개\n농장을 도둑맞지 않도록 지켜라',
        copc: 'COPC\n생태학적 디지털 자산',
        gold: '금화\n사용 copc'
    },
    steal: {
        autoRefresh: '자동 새로고침 카운트다운：',
        today: '오늘 따기:',
        todayCan: '고를 수도 있다:'
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.kr = languages;
