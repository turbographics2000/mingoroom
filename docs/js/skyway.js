var apiKey = '5aeee120-69f8-4f6e-80d7-643f1eb7070d';
var mingolName = '';
var anonymousPeerId = 'anonymouse' + (new MediaStream).id.replace(/\{|\}|-/g, '').substr(0, 20);
var anonymousPeer = new Peer({ key: apiKey, id: anonymousPeerId });

anonymousPeer.on('open', function (id) {
});


function accountIdValidate(mingolName, twitterId) {
    new Promise((resolve, reject) => {

    });
}


function connectedCheck(peer, twitterId) {
    new Promise((resolve, reject) => {
        peer.listAllPeers(function (list) {
            if (list.filter(peerId => !peerId.startsWith('anonymous')).some(peerId => {
                // 'おし'はみんゴルの名前に使用できない
                return twitterId === peerId.split('おし')[1];
            })) {
                // 接続あり
                reject();
            } else {
                // 接続なし
                resolve();
            }
        });
    })
}


peer.connect('')
