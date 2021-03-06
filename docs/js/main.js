var accountId = 'gtk2kおしgtk2k';
var peer;
var accounts = {};
var myRooms = {};
var rooms_id = {};
var rooms_datetime = {};
var rooms_owner = {};
var skywayAPIKey = '5aeee120-69f8-4f6e-80d7-643f1eb7070d';
var currentRoomData = {};
var maxRoomRow = null;
var maxRoomCount = 0;
var currentDialog = null;
var currentOKButton = null;
var currentCancelButtn = null;
var currentMode = 'add';

function $(selector, func, parent) {
  (parent || document).querySelectorAll(selector).forEach(func);  
};
function classAdd(elm, cls) {
    elm.classList.add(cls);
}
function classRemove(elm, cls) {
    elm.classList.remove(cls);
}
function elmShow(elm) {
    classRemove(elm, 'hide');
}
function elmHide(elm) {
    classAdd(elm, 'hide');
}
function appendChild(parent, child) {
    if(!Array.isArray(child)) child = [child];
    child.forEach(elm => parent.appendChild(elm));
}
function objKeys(obj) {
    return Object.keys(obj);
}
function objKeysEach(obj, func) {
    objKeys(obj).forEach(func);
}
function upsertDataset(elm, dataset) {
    objKeysEach(dataset, key => elm.dataset[key] = dataset[key]);
}
function deleteDataset(elm, keys) {
    if(!Array.isArray(keys)) keys = [keys];
    keys.forEach(key => delete elm.datase[key]);
}


var courses = {
    tokyo: {normal:'東京グランドゴルフガーデン', short: '東京'},
    scotish: {normal:'スコティッシュクラシック', short: 'スコティッシュ'},
    ocean: {normal:'オーシャンラグーンリゾード', short: 'オーシャン'},
    kafu: {normal:'華風カントリー倶楽部', short: '華風'},
    panta: {normal:'パンターノカントリークラブ', short: 'パンタ'},
    acro: {normal:'アクロポリスレガシー', short: 'アクロ'} 
}


// debugData
var debugAccounts = {
    'gtk2kおしgtk2k': {
        avatar: 'https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-1/c12.12.155.155/316037_263156007067869_1584096327_n.jpg?oh=c35fab418dd26663ab5d83dbc8876c1f&oe=5A126831',
        name: 'gtk2k',
        twitterId: 'gtk2k',
    },
    'rittoおしritto': {
        avatar: 'https://pbs.twimg.com/profile_images/3505213319/b01e2067b3fa616659f3e9cd8e9bc0e7_400x400.jpeg',
        name: 'ritto',
        twitterId: 'ritto'
    },
    'あいうえおおしAAAAAAAAAAAAAAAAAAAA':{
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_a.png',
        name: 'あいうえお',
        twitterId: 'AAAAAAAAAAAAAAAAAAAA'
    },
    'かきくけこおしBBBBBBBBBBBBBBBBBBBB' : {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_k.png',
        name: 'かきくけこ',
        twitterId: 'BBBBBBBBBBBBBBBBBBBB'
    },
    'さしすせそおしCCCCCCCCCCCCCCCCCCCC': {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_s.png',
        name: 'さしすせそ',
        twitterId: 'CCCCCCCCCCCCCCCCCCCC'
    },
    'たちつてとおしDDDDDDDDDDDDDDDDDDDD': {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_t.png',
        name: 'たちつてと',
        twitterId: 'DDDDDDDDDDDDDDDDDDDD'
    },
    'なにぬねのおしEEEEEEEEEEEEEEEEEEEE': {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_t.png',
        name: 'なにぬねの',
        twitterId: 'EEEEEEEEEEEEEEEEEEEE'
    },
    'はひふへほおしFFFFFFFFFFFFFFFFFFFF': {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_t.png',
        name: 'はひふへほ',
        twitterId: 'FFFFFFFFFFFFFFFFFFFF'
    },
    'まみむめもおしGGGGGGGGGGGGGGGGGGGG': {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_t.png',
        name: 'まみむめも',
        twitterId: 'GGGGGGGGGGGGGGGGGGGG'
    },
    'やゆよおしHHHHHHHHHHHHHHHHHHHH': {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_t.png',
        name: 'やゆよ',
        twitterId: 'HHHHHHHHHHHHHHHHHHHH'
    },
    'らりるれろおしIIIIIIIIIIIIIIIIIIII': {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_t.png',
        name: 'らりるれろ',
        twitterId: 'IIIIIIIIIIIIIIIIIIII'
    },
    'わをんおしJJJJJJJJJJJJJJJJJJJJ': {
        avatar: 'https://turbographics2000.github.io/360viewer_demo/avatar_t.png',
        name: 'わをん',
        twitterId: 'JJJJJJJJJJJJJJJJJJJJ'
    }
};

function createDebugRoom(year, month, day, hour, minute) {
    for(var i = 0; i < 144; i++) {
        var hour = i / 6 | 0;
        var minute = (i % 6) * 10;
        var time =('0' + hour).slice(-2) + ('0' + minute).slice(-2);
        var roomCount = Math.random() * 13 | 0;
        var course = objKeys(courses)[Math.random() * 6 | 0];
        for(var r = 0; r < roomCount; r++) {
            var roomId = UUID.generate();//'room' + (rid++); 
            var data = {
                roomId: roomId,
                year: 2017,
                month: 8,
                day: 20,
                hour: hour,
                minute: minute,
                title: '残暑お見舞い大会ーーーー',
                course: course,
                hole: [3, 6, 9][Math.random() * 3 | 0],
                no: '999999',
                comment: 'ほげ',
                owner: objKeys(debugAccounts)[Math.random() * 2 | 0],
                members: objKeys(debugAccounts).slice(2).slice(0, Math.random() * 11 | 0),
                create_datetime: Date.now()
            };
            upsertRoomData(data);
        }
    }
}

function appendDebugRoom() {
    objKeysEach(room_id, roomId => appendRoom(rooms_id[roomId]));
}

accounts = debugAccounts;
createDebugRoom();
getMaxRoomCount();
appendTimetableRow(2017, 8, 20);
updateAllRow();

accountAvatar.src = accounts[accountId].avatar;

window.onkeydown = function(evt) {
    if(evt.keyCode === 13) { // Enter
        currentOKButton.onclick.call(currentOKButton);
    } else if(evt.keyCode === 27) { // Esc
        currentCancelButton.onclick.call(currentCancelButton);
    }
}

btnGoToStep1.onclick = function (evt) {
    elmHide(startDialog);
    elmShow(step1Dialog);
};
btnGoToStep2.onclick = function (evt) {
    elmHide(step1Dialog);
    elmShow(step2Dialog);
};
btnRegAccountStep.onclick = function (evt) {
    elmHide(step2Dialog);
    createRegAccountKey();
    elmShow(regAccountDialog);
};

btnRegAccount.onclick = function (evt) {
    elmHide(regAccountDialog);
    classAdd(dialogMask, 'hide');
};
btnGoToSystem.onclick = function (evt) {
    fadeOut(regAccountSuccesssDialog);
    elmHide(dialogMask);
};
btnOK.onclick = function (evt) {
    dialogHide(messageDialog);
};
btnRegRoom.onclick = function (evt) {
    debugger;
    if(!regRoomTitle.value) {
        regRoomTitle.focus();
        return;
    } 
    if(regRoomNo.value.length !== 6) {
        regRoomNo.focus();
        return;
    }
    if(!/^[0-9０－９]+$/.test(regRoomNo.value)) {
        regRoomNo.focus();
        return;
    }
    if(/^[０-９]+$/.test(regRoomNo.value)) {
      regRoomNo.value = regRoomNo.value.replace(/[０-９]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      });
    }
    var data = currentRoomData;
    var isCreateRoom = !currentRoomData.roomId;
    
    data.title = regRoomTitle.value;
    data.roomId = data.roomId || UUID.generate();
    data.dt = data.dt || new Date(data.year, data.month, data.day, data.hour, data.minute);
    data.owner = accountId;
    data.title = regRoomTitle.value;
    data.course = regRoomCourse.value;
    data.hole = regRoomHole.value;
    data.no = regRoomNo.value;
    data.comment = regRoomComment.value;
 
    upsertRoomData(data);
    appendRoom(data);
    dialogHide(roomDialog);
};
btnRegRoomCancel.onclick = function() {
    dialogHide(roomDialog);
};
btnRoomEdit.onclick = function() {
    dialogHide(roomViewDialog);
    roomDialogShow();
};
btnRoomViewDialogClose.onclick = function() {
    dialogHide(roomViewDialog);
};
btnModeChange.onclick = function() {
    if(this.classList.contains('delete-mode')) {
        classRemove(this, 'delete-mode');
        modeChangeLabel.textContent = '追加モード';
        $('.create-room-button', elm => elmShow(elm));
        $('.row[data-room-count="0"], .row[data-my-room-count="0"]', row => classRemove(row, 'empty'));
        $('.room', elm => classRemove(elm, 'delete-mode'));
        filterCourse.onchange.call(filterCourse);
        //elmShow(filterMask);
        currentMode = 'add';
    } else {
        classAdd(this, 'delete-mode');
        modeChangeLabel.textContent = '削除モード';
        $('.create-room-button', elm => elmHide(elm));
        $('.room:not([data-owner="' + accountId + '"])', elm => elmHide(elm));
        $('.row[data-room-count="0"], .row[data-my-room-count="0"]', row => classAdd(row, 'empty'));
        $('.room', elm => classAdd(elm, 'delete-mode'));
        currentMode = 'delete';
    }
    //document.querySelector('div[data-owner="gtk2kおしgtk2k"]');
};

filterCourse.onchange = filterHole.onchange = function() {
    var filter = '';
    $('.room', elm => elmShow(elm));
    if(filterCourse.value !== 'all') {
        filter += '.room:not([data-course="' + filterCourse.value + '"])';
    }
    if(filterHole.value !== 'all') {
        filter += (filter ? ',' : '') + '.room:not([data-hole="' + filterHole.value + '"])';
    }
    if(filter) {
        $(filter, elm => elmHide(elm));
    }
};


function appendTimetableRow(year, month, day) {
    var dateRow = document.createElement('div');
    var colHeader = document.createElement('div');
    dateRow.className = 'timetable-daterow';
    dateRow.textContent = fmt('y/m/d', year, month, day);
    
    colHeader.className = 'timetable-colheader border-bottom';
    colHeader.style.width = ((maxRoomCount * 208) + 50 + 80) + 'px';
    for(var i = 1; i <= maxRoomCount; i++) {
        var headerCol = document.createElement('div');
        headerCol.textContent = i;
        appendChild(colHeader, headerCol);
    }
    appendChild(mingoroomContainer, [dateRow, colHeader]);
    
    for (var hour = 0; hour < 24; hour++) {
        for (var minute = 0; minute < 60; minute += 10) { 
            var row = document.createElement('div');
            var rowHeader = document.createElement('div');
            var rowTime = document.createElement('div');
            var roomCount = document.createElement('div');
            var btnCreateRoom = document.createElement('div');
            var btnDelete = document.createElement('div');

            row.id = 'row' + fmt('ymdhm', year, month, day, hour, minute);
            roomCount.id = row.id + 'RoomCount';
            row.style.width = ((maxRoomCount * 208) + 50 + 80) + 'px';
            row.dataset.roomCount = '0';
            rowTime.textContent = fmt('h:m', 0, 0, 0, hour, minute, true);
            roomCount.textContent = '0室';
            classAdd(row, 'row');
            classAdd(rowHeader, 'rowheader');
            classAdd(rowTime, 'timetable-time');
            classAdd(roomCount, 'timetable-roomcount');
            classAdd(btnCreateRoom, 'create-room-button');
            if(currentMode === 'delete') {
                elmHide(btnCreateRoom);
            }
            
            upsertDataset(btnCreateRoom, {year, month, day, hour, minute});
            btnCreateRoom.onclick = function(evt) {
                currentRoomData = {
                    year: +this.dataset.year,
                    month: +this.dataset.month,
                    day: +this.dataset.day,
                    hour: +this.dataset.hour,
                    minute: +this.dataset.minute
                };
                roomDialogShow();
            }

            appendChild(rowHeader, [rowTime, roomCount, btnCreateRoom]);
            appendChild(row, rowHeader);            
            appendChild(mingoroomContainer, row);
        }
    }
}

function updateAllRow() {
    objKeysEach(rooms_datetime, date => {
        objKeysEach(rooms_datetime[date], time => {
            updateRow(date, time);
        });
    })
}

function updateRow(date, time) {
    var rowId = 'row' + date + time;
    var row = window[rowId];
    var rowHeader = window[rowId + 'RoomCount'];
    var roomIds = objKeys(rooms_datetime[date][time]); 
    var roomCount = roomIds.length;
    var myRoomCount = 0;
    $('.room', elm => elm.remove(), window[rowId]);
    rowHeader.textContent = roomCount + '室';
    roomIds.sort((a, b) => {
        return rooms_id[a].create_datetime - rooms_id[b].create_datetime;
    });
    roomIds.forEach(roomId => {
        if(rooms_id[roomId].owner === accountId) myRoomCount++;
        appendRoom(rooms_id[roomId]);
    });
    upsertDataset(row, {roomCount, myRoomCount});
}

function appendRoom(data) {
    var date = fmt('ymd', data.year, data.month, data.day);
    var time = fmt('hm', 0, 0, 0, data.hour, data.minute);
    var row = window['row' + date + time];
    if(!row) return;
    
    var room = document.createElement('div');
    var roomTitle = document.createElement('div');
    var course = document.createElement('div');
    var hole = document.createElement('div');
    var ownerAvatar = document.createElement('img');
    var roomNo = document.createElement('div');
    var member = document.createElement('div');

    classAdd(room, 'room');
    classAdd(roomTitle, 'room-title');
    classAdd(roomNo, 'room-no');

    room.id = data.roomId;
    upsertDataset(room , {owner: data.owner, course: data.course, hole: data.hole});
    room.onclick = function(evt) {
        var data = rooms_id[this.id];
        if(currentMode === 'add') {
        currentRoomData = {};
        Object.assign(currentRoomData, data);
        roomDialogShow(true);
        } else {
            message.textContent = data.title
        }
    };
    roomTitle.textContent = data.title;
    roomNo.textContent = '#' + ('00000' + data.no).slice(-6);
    course.textContent = courses[data.course].short + ' ' + data.hole + 'Hole';
    classAdd(course, 'course');
    classAdd(ownerAvatar, 'room-owner-avatar');
    ownerAvatar.alt = ownerAvatar.title = '作成者：' + accounts[rooms_id[data.roomId].owner].name + '(@' + accounts[rooms_id[data.roomId].owner].twitterId + ')';
    ownerAvatar.src = accounts[rooms_id[data.roomId].owner].avatar;
    member.textContent = '参加予定：'　+ 99999;

    appendChild(roomNo, ownerAvatar);
    appendChild(room, [roomTitle, course, member, roomNo]);
    appendChild(row, room);
}

function createRegAccountKey() {
    accountKey = UUID.generate().replace(/\{|\}|-/g, '').substr(0, 20);
    accountKeyDisp.textContent = accountKey;
    regAccountFailMsg.textContent = 'アカウント登録に失敗しました。Twitterのアカウント名が ' + accountKey + ' になっているか確認し、再度登録を行ってください。';
}

function regAccount() {
    validateAccountKey().then(_ => {
        return new Promise((resolve, reject) => {
            var anonymousPeerId = 'anonymouse' + (new MediaStream).id.replace(/\{|\}|-/g, '').substr(0, 20);
            var anonymousPeer = new Peer({ key: apiKey, id: anonymousPeerId });
            peer.on('open', _ => {
                connectedCheck(anonymousPeer, regTwitterId.value).then(_ => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            });
            peer.on('error', err => {
                reject('他の端末での接続チェックで接続チェック用のピアでの接続が行えず、アカウント登録が行えません。' + err);
            });
        });
    }).then(_ => {
        twitterId = regTwitterId.value;
        mingolName = regMingolName.value;
        chrome.storage.sync.set('twitterId', twitterId);
        chrome.storage.sync.set('mingolName', mingolName);
        mingoroomAccountId = mingolName + '@' + twitterId;
        elmHide(regAccountDialog);
        elmShow(regAccountSuccesssDialog);
    }).catch(err => {
        if (err === 'connected') {
            regAccountFailMsg.textContent = '他の端末から @' + twitterId + ' ですでに接続しています。この端末に @' + twitterId + ' で登録したい場合は、いったん他の端末で開いている「みんなでゴルフ待合所(仮題)」のページを閉じてから登録を行ってください。';
        } else {
            regAccountFailMsg.textContent = err;
        }
        elmShow(regAccountFailDialog);
    });
}

function validateAccountKey(twitterId) {
    return fetch('https://twitter.com/' + twitterId).then(res => {
        return new Promise((resolve, reject) => {
            if (res.ok) {
                resolve(res.text());
            } else {
                reject('入力したTwitterID ' + twitterId + ' は存在しないようです。入力したTwitterIDを確認してください。');
            }
        });
    }).then(txt => {
        return new Promise((resolve, reject) => {
            try {
                var parser = new DOMParser();
                var dom = parser.parseFromString(txt, 'text/html');
                var elmTwitterName = dom.querySelector('.ProfileHeaderCard-name');
                if (elmTwitterName) {
                    twitterName = elmTwitterName.textContent.trim();
                    if (twitterName === accountKey) {
                        resolve();
                    } else {
                        reject('認証キーが一致しません。入力した認証キーを確認してください。');
                    }
                } else {
                    reject('Twitterのページデザインが変更になった等により、ページのパースに失敗しアカウント登録が行えません。');
                }
            } catch (e) {
                reject('Twitterのページをパースするときにエラーが発生しアカウント登録が行えません。');
            }
        });
    }).catch(err => {
        reject('fetch()実行時にエラーが発生しアカウント登録が行えません。' + (err.message || err));
    });
}

function connectedCheck(peer, twitterId) {
    new Promise((resolve, reject) => {
        peer.listAllPeers((list) => {  // エラーになってもコールバックされる(引数の値は[](要素数0の配列))
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
    })
}

function roomDialogShow(isView) {
    var roomId = currentRoomData.roomId;
    var year = currentRoomData.year;
    var month = currentRoomData.month;
    var day = currentRoomData.day;
    var hour = currentRoomData.hour;
    var minute = currentRoomData.minute;
    var title = currentRoomData.title || '';
    var course = currentRoomData.course;
    var hole = currentRoomData.hole;
    var comment = currentRoomData.comment || '';
    
    if(isView) {
        viewRoomTitle.textContent = title;
        viewRoomSummary.textContent = [
            fmt('y/m/d h:m', year, month, day, hour, minute),
            courses[course].short,
            hole +'hole'
        ].join(' ');
        viewRoomComment.textContent = comment;

        setMemberList(currentRoomData.members);
        dialogShow(roomViewDialog);
        
        currentDialog = roomViewDialog;
        currentOKButton = currentCancelButton = btnRoomViewDialogClose;
    } else {
        roomStartDate.textContent = fmt('y/m/d', year, month, day);
        roomStartTime.textContent = fmt('h:m', 0, 0, 0,hour, minute);
        regRoomTitle.value = title;
        regRoomCourse.value = 'tokyo';
        regRoomHole.value = '3';
        regRoomComment.value = comment;
        dialogShow(roomDialog);
        
        currentDialog = roomDialog;
        currentOKButton = btnRegRoom;
        currentCancelButton = btnRegRoomCancel;
    }
}

function createRoom(evt) {
    //var minMinute = ((minDate.getMinutes() + 15) / 15 | 0) * 15;
    roomStartDate.textContent = fmt('y/m/d', currentRoomData.year, currentRoomData.month, currentRoomData.day);
    roomStartTime.textContent = fmt('h:m', 0, 0, 0, currentRoomData.hour, currentRoomData.minute);
    regCourseSelect.value = 'tokyo';
    regHoleSelect.value = '3';
    regRoomNo.value = '';
    regRoomComment.value = '';

    dialogShow(roomDialog);
}

function setMemberList(members) {
    memberList.innerHTML = '';
    viewRoomMemberCount.textCount = members.length + '人';
    if(members) {
        members.forEach(memberId => {
            var accountData = accounts[memberId];
            var member = document.createElement('div');
            var memberAvatar = document.createElement('img');
            var memberName = document.createElement('span');
            var memberTwitterId = document.createElement('span');

            classAdd(member, 'member');
            classAdd(memberAvatar, 'member-avatar');
            classAdd(memberName, 'member-name');
            classAdd(memberTwitterId, 'member-twitterid');
            
            if(accountData.avatar) {
                memberAvatar.src = accountData.avatar;
            }
            memberName.textContent = accountData.name;
            memberTwitterId.textContent = '(@' + accountData.twitterId + ')';

            appendChild(member, [memberAvatar, memberName, memberTwitterId]);
            appendChild(memberList, member);
        });
    }
}

function dialogShow(dialog) {
    elmShow(dialogMask);
    elmShow(dialog);
}
function dialogHide(dialog) {
    elmHide(dialogMask);
    elmHide(dialog);
}

function fmt(format, year, month, day, hour, minute) {
    month = ('0' + month).slice(-2);
    day = ('0' + day).slice(-2);
    hour = ('0' + hour).slice(-2);
    minute = ('0' + minute).slice(-2);
    switch(format) {
        case 'y/m/d':
            return [year, month, day].join('/');
        case 'ymd':
            return year + month + day;
        case 'y/m/d h:m':
            return [year, month, day].join('/') + ' ' + [hour, minute].join(':');
        case 'ymdhm':
            return year + month + day + hour + minute;
        case 'h:m':
            return [hour, minute].join(':');
        case 'hm':
            return hour + minute;
    } 
}


function upsertRoomData(data){
    var roomId = data.roomId;
    var date = fmt('ymd', data.year, data.month, data.day);
    var time = fmt('hm', 0, 0, 0, data.hour, data.minute);
    var owner = data.owner;
    
    rooms_id[roomId] = rooms_id[roomId] || data;
    
    if(rooms_id[roomId].owner === accountId) {
        myRooms[roomId] = data;
    }
    
    rooms_datetime[date] = rooms_datetime[date] || {};
    rooms_datetime[date][time] = rooms_datetime[date][time] || {};
    rooms_datetime[date][time][roomId] = rooms_datetime[date][time][roomId] || data;

    rooms_owner[owner] = rooms_owner[owner] || {};
    rooms_owner[owner][roomId] = rooms_owner[owner][roomId] || data;
}

function getMaxRoomCount() {
    objKeysEach(rooms_datetime, date => {
        var roomsParDate = rooms_datetime[date];
        objKeysEach(roomsParDate, time => {
            var roomsParDatetime = roomsParDate[time];
            maxRoomCount = Math.max(objKeys(roomsParDatetime).length, maxRoomCount);
        })
    });
}

