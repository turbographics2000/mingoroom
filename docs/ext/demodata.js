var demoAccounts = {
    'AAAAAAAAAAAAAAAAAAAA': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_a.png',
        mingolName: 'あいうえお',
        twitterScrName: 'AAAAAAAAAAAAAAAAAAAA'
    },
    'BBBBBBBBBBBBBBBBBBBB': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_k.png',
        mingolName: 'かきくけこ',
        twitterScrName: 'BBBBBBBBBBBBBBBBBBBB'
    },
    'CCCCCCCCCCCCCCCCCCCC': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_s.png',
        mingolName: 'さしすせそ',
        twitterScrName: 'CCCCCCCCCCCCCCCCCCCC'
    },
    'DDDDDDDDDDDDDDDDDDDD': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_t.png',
        mingolName: 'たちつてと',
        twitterScrName: 'DDDDDDDDDDDDDDDDDDDD'
    },
    'EEEEEEEEEEEEEEEEEEEE': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_n.png',
        mingolName: 'なにぬねの',
        twitterScrName: 'EEEEEEEEEEEEEEEEEEEE'
    },
    'FFFFFFFFFFFFFFFFFFFF': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_h.png',
        mingolName: 'はひふへほ',
        twitterScrName: 'FFFFFFFFFFFFFFFFFFFF'
    },
    'GGGGGGGGGGGGGGGGGGGG': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_m.png',
        mingolName: 'まみむめも',
        twitterScrName: 'GGGGGGGGGGGGGGGGGGGG'
    },
    'HHHHHHHHHHHHHHHHHHHH': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_y.png',
        mingolName: 'やゆよ',
        twitterScrName: 'HHHHHHHHHHHHHHHHHHHH'
    },
    'IIIIIIIIIIIIIIIIIIII': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_r.png',
        mingolName: 'らりるれろ',
        twitterScrName: 'IIIIIIIIIIIIIIIIIIII'
    },
    'JJJJJJJJJJJJJJJJJJJJ': {
        avatar: 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_w.png',
        mingolName: 'わをん',
        twitterScrName: 'JJJJJJJJJJJJJJJJJJJJ'
    }
};

var demoRoomsSrc = [
    {
        title: '残暑お見舞い大会',
        year: nowYear(),
        month: nowMonth(),
        day: nowDay(),
        course: 'panta',
        hole: '9',
        owner: objKeys(demoAccounts, 0),
        no: '365365',
        members: objKeys(demoAccounts).slice(4, 5 + Math.random() * 5 | 0)
    },
    {
        title: '延長戦',
        year: nowYear(),
        month: nowMonth(),
        day: nowDay(),
        course: 'tokyo',
        hole: '6',
        owner: objKeys(demoAccounts, 1),
        no: '123123',
        members: objKeys(demoAccounts).slice(4, 5 + Math.random() * 5 | 0)
    },
    {
        title: 'SRギア縛り大会',
        year: nowYear(),
        month: nowMonth(),
        day: nowDay(),
        course: 'ocean',
        hole: '3',
        owner: objKeys(demoAccounts, 2),
        no: '898989',
        members: objKeys(demoAccounts).slice(4, 5 + Math.random() * 5 | 0)
    },
    {
        title: 'パター縛り大会',
        year: nowYear(),
        month: nowMonth(),
        day: nowDay(),
        course: 'ocean',
        hole: '6',
        owner: objKeys(demoAccounts, 3),
        no: '012345',
        members: objKeys(demoAccounts).slice(4, 5 + Math.random() * 5 | 0)
    },
];

