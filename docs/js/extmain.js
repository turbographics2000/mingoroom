var step = localStorage.getItem('step') || 'extNotInstalled';
var extId = 'ioaancmfccbkoknfeibefmdahkpiincg';
//var extId = 'ioaancmfccbkoknfeibefmdahkpiinch';

btnExtInstall.onclick = btnExtInstall2.onclick = function () {
    step = 'installButtonClicked';
    localStorage.setItem('step', step);
    var win = window.open('https://chrome.google.com/webstore/detail/gellpinfkckcbeebkhanmfkfgihelpfm/publish-delayed?hl=ja', '_blank');
    win.focus();
};

chrome.runtime.sendMessage(extId, { installCheck: true }, res => {
    // インストールされていない場合は
    // res=undefined
    // になる
    if (res) {
        console.log('ext installed');
        step = 'extInstalled';
        localStorage.setItem('step', step);
    } else {
        if (step === 'extNotInstalled') {
            welcomDialog.classList.remove('hide');
        } else if (step === 'installButtonClicked') {
            extNotInstalledDialog.classList.remove('hide');
        }
    }
});

window.addEventListener('regAccount', evt => {
    connectedCheck().then(_ => {
        twitterId = regTwitterId.value;
        mingolName = regMingolName.value;
        chrome.storage.local.set('twitterId', twitterId);
        chrome.storage.local.set('mingolName', mingolName);
        mingoroomAccountId = mingolName + '@' + twitterId;
        elmHide(regAccountDialog);
        elmShow(regAccountSuccesssDialog);
    }).catch(err => {
        if (err === 'connected') {
            messageDialogShow('他の端末から @' + twitterId + ' ですでに接続しています。この端末に @' + twitterId + ' で登録したい場合は、いったん他の端末で開いている「みんなでゴルフ待合所(仮題)」のページを閉じてから登録を行ってください。');
        } else {
            messageDialogShow(err);
        }
    });
});

function connectedCheck(peer, twitterId) {
    new Promise((resolve, reject) => {
        var anonymousPeerId = 'anonymouse' + (new MediaStream).id.replace(/\{|\}|-/g, '').substr(0, 20);
        var anonymousPeer = new Peer(anonymousPeerId, { key: skywayAPIKey });
        anonymousPeer.on('open', id => {
            peer.listAllPeers(list => {  // エラーになってもコールバックされる(引数の値は[](要素数0の配列))
                peer.close();
                if (list.filter(peerId => !peerId.startsWith('anonymous')).some(peerId => {
                    // 'おし'はみんゴルの名前に使用できない
                    return twitterId === peerId.split('おし')[1];
                })) {
                    // 接続あり
                    reject('connected');
                } else {
                    // 接続なし
                    resolve();
                }
            });    
        });
        anonymousPeer.on('error', err => {
            reject('他の端末での接続チェックで接続チェック用のピアでの接続が行えず、アカウント登録が行えません。' + err);
        });
    })
}