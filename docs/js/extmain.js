var step = localStorage.getItem('step') || 'extNotInstalled';
var extId = 'ioaancmfccbkoknfeibefmdahkpiincg';
//var extId = 'ioaancmfccbkoknfeibefmdahkpiinch';
var skywayAPIKey = '5aeee120-69f8-4f6e-80d7-643f1eb7070d';
var myAccountData = {
    mingolName: null,
    twitterScrName: null,
    avatar: null
};
var myRooms = null;
var rooms_id = null;
var peer = null;
var dcs = {};

btnStorageClear.addEventListener('click', evt => {
    delete localStorage.step;
    console.log('localStorage.step cleared.');    
});

function dispatchCustomEvent(eventName, detail = null) {
    var evt = new CustomEvent(eventName, { detail });
    window.dispatchEvent(evt);
}

btnExtInstall.onclick = btnExtInstall2.onclick = function () {
    step = 'installButtonClicked';
    localStorage.setItem('step', step);
    var win = window.open('https://chrome.google.com/webstore/detail/gellpinfkckcbeebkhanmfkfgihelpfm', '_blank');
    win.focus();
};
btnReload.onclick = btnReload2.onclick = function () {
    document.location.reload();
}

chrome.runtime.sendMessage(extId, { installCheck: true }, res => {
    // インストールされていない場合は
    // res=undefined
    // になる
    if (res) {
        console.log('ext installed');
        step = 'extInstalled';
        localStorage.setItem('step', step);
    } else {
        tutorialMask.style.background = 'gray';
        tutorialMask.classList.remove('hide');
        if (step === 'extNotInstalled') {
            startDialog.classList.remove('hide');
        } else if (step === 'installButtonClicked') {
            extNotInstalledDialog.classList.remove('hide');
        }
    }
});

window.addEventListener('regAccount', evt => {
    connectedCheck(regTwitterScrName.value).then(_ => {
        dispatchCustomEvent('regAccountSuccess');
    }).catch(err => {
        if (err === 'connected') {
            messageDialogShow('他の端末で @' + regTwitterScrName.value + ' ですでに接続しています。この端末で @' + regTwitterScrName.value + ' で登録したい場合は、いったん他の端末で開いている「みんなでゴルフ待合所(仮題)」のページを閉じてから登録を行ってください。');
        } else {
            messageDialogShow(err);
        }
    });
});

window.addEventListener('connectedCheck', evt => {
    connectedCheck(evt.detail.twitterScrName).then(_ => {
        dispatchCustomEvent('connectedCheckPass');
    }).catch(_ => {
        dispatchCustomEvent('connectedCheckFail');
    });
});

window.addEventListener('connectPeer', evt => {
    Object.assign(myAccountData, evt.detail);

    peer = new Peer(myAccountData.twitterScrName, { key: skywayAPIKey });
    peer.on('open', list => {
        console.log('peer open.');
        peer.listAllPeers(list => {
            list = list.filter(id => !id.startsWith('anonymous') && id !== myAccountData.twitterScrName);
            list.forEach(id => {
                var dc = peer.connect(id);
                dc.on('open', _ => {
                    console.log('dc open.');
                    dc.on('data', data => {
                        var msg = JSON.parse(data);
                        dispatchCustomEvent('dc_msg', { detail: msg });
                    });
                });
            })
        });
    });
    peer.on('connection', con => {
        console.log('dc connect.[' + con.id + ']');
        dc = con;
        dispatchCustomEvent('dc_msg', { connectTwitterScrName: dc.peer });
        dc.on('close', _ => {
            dispatchCustomEvent('dc_msg', { disconnectTwitterScrName: dc.peer });
        });
        var msg = JSON.stringify({
            account: myAccountData,
            rooms: myRooms ? myRooms : null
        });
        dc.send(msg);
    });
    peer.on('error', err => {
        console.log('peer error.', err);
    })
});

function connectedCheck(twitterScrName) {
    return new Promise((resolve, reject) => {
        var anonymousPeerId = 'anonymous' + (new MediaStream).id.replace(/\{|\}|-/g, '').substr(0, 20);
        var anonymousPeer = new Peer(anonymousPeerId, { key: skywayAPIKey });
        anonymousPeer.on('open', id => {
            anonymousPeer.listAllPeers(list => {  // エラーになってもコールバックされる(引数の値は[](要素数0の配列))
                anonymousPeer.destroy();
                if (list.filter(peerId => !peerId.startsWith('anonymous')).some(peerId => {
                    // 'おし'はみんゴルの名前に使用できない
                    return twitterScrName === peerId.split('おし')[1];
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

