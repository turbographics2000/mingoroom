
var courses = {
    tokyo: { normal: '東京グランドゴルフガーデン', short: '東京' },
    scotish: { normal: 'スコティッシュクラシック', short: 'スコティッシュ' },
    ocean: { normal: 'オーシャンラグーンリゾード', short: 'オーシャン' },
    kafu: { normal: '華風カントリー倶楽部', short: '華風' },
    panta: { normal: 'パンターノカントリークラブ', short: 'パンタ' },
    acro: { normal: 'アクロポリスレガシー', short: 'アクロ' }
};
var myAccountData = {
    mingolName: null,
    twitterScrName: null,
    avatar: null
};
var accounts = {};
var onlineAccounts = {};
var myFriends = [];
var myRooms = {};
var myRoomTemplates = {};
var roomTemplates = {};
var rooms_id = {};
var rooms_datetime = {};
var rooms_owner = {};
var currentRoomData = {};
var maxRoomCount = 0;
var currentDialog = null;
var currentOKButton = null;
var currentCancelButtn = null;
var currentMode = 'add';
var stepNo = 0;
var MAX_PAR_MINUTE = 1;
var MAX_PAR_HOUR = 3;
var skywayAPIKey = '5aeee120-69f8-4f6e-80d7-643f1eb7070d';
var peer;
var stats = {};

btnStorageClear.addEventListener('click', evt => {
    chrome.storage.local.clear();
    console.log('chrome.storage cleared.');
});

function stepNextDialogShow(stepNo) {
    tutorialMask.show();
    var stepDialogs = document.querySelectorAll('.step-dialog');
    stepDialogs.forEach(dialog => dialogHide(dialog));
    dialogChangeTo(stepDialogs[stepNo]);
    if (stepNo < 3) {
        tutorialMask.style.background = 'gray';
    } else {
        $('.step-dialog', elm => {
            elm.classAdd('opdesc-mode');
        });
        accountAvatar.src = 'https://turbographics2000.github.io/mingoroom/imgs/avatar/avatar_a.png';
        tutorialMask.style.background = 'rgba(0,0,0,0.01)';
        if (stepNo === 3) {
            accountAvatar.show();
            appendTimetableRow(new IntervalDate());
        } else if (stepNo === 4) {
            accounts = demoAccounts;
            createDemoRoom(nowDt.year, nowDt.month, nowDt.day);
            getMaxRoomCount();
            applyMaxRoomCount();
            updateAllRow();
        } else if (stepNo === 5) {
            document.querySelector('.room').click();
        } else if (stepNo === 6) {
            dialogHide(roomViewDialog);
            $('.row', row => {
                row.querySelector('.room').classAdd('reserved');
            });
        } else if (stepNo === 7) {
            $('.reserved', elm => {
                elm.classAdd('reserved');
            });
            $('.create-room-button', elm => {
                elm.classAdd('opdesc-mode');
            });
        } else if (stepNo === 8) {
            $('.create-room-button', elm => {
                elm.classRemove('opdesc-mode');
            });
            btnModeChange.classAdd('opdesc-mode');
        } else if (stepNo === 9) {
            btnModeChange.classRemove('opdesc-mode');
            myAccountData = demoAccounts[objKeys(demoAccounts)[0]];
            updateAllRow();
            btnModeChange.click();
        } else if (stepNo === 10) {
            btnModeChange.click();
            accountAvatar.classAdd('opdesc-mode');
        } else if (stepNo === 11) {
            accountAvatar.classRemove('opdesc-mode');
        }
    }
}

function stepBackDialogShow(stepNo) {
    tutorialMask.show();
    var stepDialogs = document.querySelectorAll('.step-dialog');
    stepDialogs.forEach(dialog => dialogHide(dialog));
    dialogChangeTo(stepDialogs[stepNo]);
    if (stepNo < 3) {
        tutorialMask.style.background = 'gray';
        $('.step-dialog', elm => classRemove(elm, 'opdesc-mode'));
        accountAvatar.hide();
        mingoroomContainer.innerHTML = '';
    } else {
        if (stepNo === 3) {
            clearRoomData();
            mingoroomContainer.innerHTML = '';
            appendTimetableRow(new IntervalDate());
        } else if (stepNo === 4) {
            dialogHide(roomViewDialog);
        } else if (stepNo === 5) {
            document.querySelector('.room').click();
            $('.reserved', elm => {
                elm.classRemove('reserved');
            });
        } else if (stepNo === 6) {
            dialogHide(roomViewDialog);
            $('.create-room-button', elm => {
                elm.classRemove('opdesc-mode');
            });
            $('.row', row => {
                row.querySelector('.room').classAdd('reserved');
            });
        } else if (stepNo === 7) {
            $('.create-room-button', elm => {
                elm.classAdd('opdesc-mode');
            });
            btnModeChange.classRemove('opdesc-mode');
        } else if (stepNo === 8) {
            btnModeChange.classAdd('opdesc-mode');
            btnModeChange.click();
        } else if (stepNo === 9) {
            accountAvatar.classRemove('opdesc-mode');
            btnModeChange.click();
        } else if (stepNo === 10) {
            accountAvatar.classAdd('opdesc-mode');
        }
    }
}

loadStorage(['step', 'myAccountData', 'myRooms', 'myFriends']).then(data => {
    if (data.step === 'complete') {
        if (data.myAccountData) {
            myAccountData = data.myAccountData;
            if (myAccountData) {
                accounts[myAccountData.twitterScrName] = myAccountData;
                accountAvatar.src = myAccountData.avatar;
                accountAvatar.show();
            }
            var startDt = new IntervalDate();
            startDt.addHours(-6);
            appendTimetableRow(startDt);
            deleteOldMyRoom(startDt);
            myFriends = data.myFriends || {};
            dispatchCustomEvent('connect', { myAccountData, myRooms });
        } else {
            btnGoToRegAccount.click();
        }
    } else {
        tutorialMask.style.background = 'gray';
        tutorialMask.show();
        dialogChangeTo(step0Dialog);
        $('.step-button', btn => {
            btn.onclick = function () {
                stepNo++;
                stepNextDialogShow(stepNo);
            }
        });
        $('.back-step-button', btn => {
            btn.onclick = function () {
                stepNo--;
                stepBackDialogShow(stepNo);
            }
        });
    }
});

window.addEventListener('connectedCheckFail', evt => {
    messageDialogShow(evt.detail);
});

window.addEventListener('peerOpen', evt => {
});
window.addEventListener('dcOpen', evt => {
    console.log('cs.js dcOpen');
    dispatchCustomEvent('send', { rooms: myRooms });
});

function createDemoRoom(dt) {
    for (var i = 0; i < 144; i++) {
        var dt = new IntervalDate();
        dt.hour = i / 6 | 0;
        dt.minute = (i % 6) * 10;

        for (var r = 0; r < roomCount; r++) {
            var roomId = UUID.generate();//'room' + (rid++); 
            var data = {
                roomId: UUID.generate(),
                dateTime: dt,
                comment: '待合室コメント',
                create_datetime: Date.now()
            };
            Object.assign(data, demoRoomsSrc[r]);
            upsertRoomData(data, false);
        }
    }
}

function appendDemoRoom() {
    objKeysEach(room_id, roomId => appendRoom(rooms_id[roomId]));
}

// accounts = demoAccounts;
// createDemoRoom();
// getMaxRoomCount();
// appendTimetableRow(2017, 8, 20);
// updateAllRow();

//accountAvatar.src = accounts[accountId].avatar;

window.onkeydown = function (evt) {
    if (evt.srcElement instanceof HTMLTextAreaElement) return;
    if (evt.keyCode === 13) { // Enter
        currentOKButton.onclick.call(currentOKButton);
    } else if (evt.keyCode === 27) { // Esc
        currentCancelButton.onclick.call(currentCancelButton);
    }
}

accountAvatar.onclick = function (evt) {
    upsertDataset(btnRegAccount, { type: 'changeAccount' });
    createRegAccountKey();
    dialogShow(accountDialog);
};

btnGoToRegAccount.onclick = function () {
    upsertDataset(btnRegAccount, { type: 'step' });
    saveStorage({ step: 'complete' }).then(_ => {
        clearRoomData();
        mingoroomContainer.innerHTML = '';
        appendTimetableRow(new IntervalDate());
        //appendTimetableRow(nowYear(), nowMonth(), nowDay() + 1);
        $('.dialog', elm => dialogHide(elm));
        tutorialMask.hide();
        createRegAccountKey();
        dialogShow(accountDialog);
    });
}
btnOK.onclick = function (evt) {
    dialogHide(messageDialog);
};
btnRegRoom.onclick = function (evt) {
    if (!regRoomTitle.value) {
        regRoomTitle.focus();
        return;
    }
    if (regRoomNo.value.length !== 6 || !/^[0-9０-９]+$/.test(regRoomNo.value)) {
        regRoomNo.focus();
        return;
    }
    if (/^[０-９]+$/.test(regRoomNo.value)) {
        regRoomNo.value = regRoomNo.value.replace(/[０-９]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }
    var data = currentRoomData;
    var isCreateRoom = !currentRoomData.roomId;

    data.title = regRoomTitle.value;
    data.roomId = data.roomId || UUID.generate();
    data.owner = myAccountData.twitterScrName;
    data.title = regRoomTitle.value;
    data.course = regRoomCourse.value;
    data.hole = regRoomHole.value;
    data.no = regRoomNo.value;
    data.comment = regRoomComment.value;
    regRoomTitle.classRemove('hasvalue');
    regRoomNo.classRemove('hasvalue');

    upsertRoomData(data);
    dialogHide(roomDialog);
    dialogHide(roomViewDialog);

    saveStorage({ myRooms }).then(_ => console.log('save myRooms.'));
};
btnRegRoomCancel.onclick = function () {
    dialogHide(roomDialog);
    dialogHide(roomViewDialog);
};
btnRoomEdit.onclick = function () {
    dialogHide(roomViewDialog);
    roomDialogShow();
};
btnRoomViewDialogClose.onclick = function () {
    dialogHide(roomViewDialog);
};
btnReserveList.onclick = function () {

};
btnModeChange.onclick = function () {
    if (this.classList.contains('delete-mode')) {
        this.classRemove('delete-mode');
        modeChangeLabel.textContent = 'ノーマル';
        $('.create-room-button', elm => {
            elm.show();
        });
        $('.timetable-roomcount', elm => {
            elm.show();
        });
        $('.row[data-room-count="0"], .row[data-my-room-count="0"]', row => {
            row.classRemove('empty');
        });
        $('.room', elm => {
            elm.classRemove('delete-mode');
        });
        filterCourse.onchange.call(filterCourse);
        //filterMask.show();
        currentMode = 'add';
    } else {
        this.classAdd('delete-mode');
        modeChangeLabel.textContent = '削除';
        $('.create-room-button', elm => {
            elm.hide();
        });
        $('.timetable-roomcount', elm => {
            elm.hide();
        });
        $('.room:not([data-owner="' + myAccountData.twitterScrName + '"])', elm => {
            elm.hide();
        });
        $('.row[data-room-count="0"], .row[data-my-room-count="0"]', row => {
            row.classAdd('empty');
        });
        $('.room', elm => {
            elm.classAdd('delete-mode');
        });
        currentMode = 'delete';
    }
    //document.querySelector('div[data-owner="gtk2kおしgtk2k"]');
};
btnRegAccount.onclick = function () {
    btnRegAccount.hide();
    if (!regMingolName.value) {
        regMingolName.focus();
        btnRegAccount.show();
        regAccountErrorMessage.textContent = 'みんゴル名を入力してください。'
        return;
    }
    if (!regTwitterScrName.value) {
        regTwitterScrName.focus();
        btnRegAccount.show();
        regAccountErrorMessage.textContent = 'Twitterのスクリーンネームを入力してください。'
        return;
    }
    regAccount();
};
btnRegTemplate.onclick = function () {
    var templateName = txtTemplateName.value.trim();
    if (templateName) {
        myRoomTemplates[templateName] = {
            title: regRoomTitle.value,
            course: regRoomCourse.value,
            hole: regRoomHole.value,
            roomNo: regRoomNo.value,
            comment: regRoomComment.value
        };
    }
};
btnReserveRoom.onclick = function () {

};

regRoomCourse.onchange = regRoomHole.onchange = function (evt) {
    roomViewSummary.textContent = [
        currentRoomData.dateTime.format('y/m/d h:m'),
        courses[regRoomCourse.value].short,
        regRoomHole.value + 'Hole'
    ].join(' ');
}
regRoomComment.oninput = function () {
    roomViewComment.innerHTML = marked(this.value.replace(/\n/g, '  \n'));
}

function requireInput() {
    if (this.value) {
        this.classAdd('hasvalue');
    } else {
        this.classRemove('hasvalue');
    }
    if (this.id === 'regRoomTitle') {
        roomViewTitle.textContent = this.value;
    } else if (this.id === 'regRoomNo') {
        roomViewRoomNo.textContent = '#' + this.value;
    }
}
$('input.require', elm => {
    elm.oninput = requireInput;
});

filterCourse.onchange = filterHole.onchange = function () {
    var filter = '';
    $('.room', elm => elm.show());
    if (filterCourse.value !== 'all') {
        filter += '.room:not([data-course="' + filterCourse.value + '"])';
    }
    if (filterHole.value !== 'all') {
        filter += (filter ? ',' : '') + '.room:not([data-hole="' + filterHole.value + '"])';
    }
    if (filter) {
        $(filter, elm => elm.hide());
    }
};


function appendTimetableRow(dt) {
    var dateRow = createElm({
        cssClassies: 'timetable-daterow center'
    });
    var colHeader = createElm({
        cssClassies: 'timetable-colheader border-bottom center',
        textContent: dt.format('y/m/d')
    });
    mingoroomContainer.appendChildren([dateRow, colHeader]);

    var startHour = 0;
    var startMinute = 0;

    var nowDt = new IntervalDate();
    if (dt.year === nowDt.year && dt.month === nowDt.month && dt.day === nowDt.day) {
        startHour = nowHour();
        startMinute = ((nowMinute() + 9) / 10 | 0) * 10;
    }

    var container = document.createDocumentFragment();

    for (var hour = startHour; hour < 24; hour++) {
        dt.hour = hour;
        for (var minute = hour === startHour ? startMinute : 0; minute < 60; minute += 10) {
            dt.minute = minute;
            var ymdhm = dt.format('ymdhm');
            var rowId = 'row' + ymdhm;
            if (window[rowId]) continue;

            var roomCount = createElm({
                id: rowId + 'RoomCount',
                textContent: '0'
            });
            var roomCountLabel = createElm({
                type: 'span',
                textContent: '室'
            });
            var roomCountContainer = createElm({
                cssClassies: 'timetable-roomcount',
                children: [roomCount, roomCountLabel]
            });
            var rowTime = createElm({
                cssClassies: 'timetable-time',
                textContent: dt.format('h:m')
            });
            var btnCreateRoom = createElm({
                cssClassies: 'create-room-button center',
                dataset: { roomCount: 0, dateTime: +dt }
            });
            var rowHeader = createElm({
                cssClassies: 'rowheader center',
                children: [rowTime, roomCountContainer, btnCreateRoom]
            });
            var row = createElm({
                id: rowId,
                cssClassies: 'row',
                children: [rowHeader]
            });
            container.appendChild(row);

            if (currentMode === 'delete') {
                btnCreateRoom.hide();
            }

            btnCreateRoom.onclick = function (evt) {
                currentRoomData = {
                    dateTime: new IntervalDate(+dt),
                    title: '',
                    course: 'tokyo',
                    hole: '3',
                    no: '',
                    members: [],
                    owner: myAccountData.twitterScrName
                };
                roomDialogShow();
                roomViewDialog.classAdd('preview');
                dialogShow(roomViewDialog);
            }
        }
    }

    mingoroomContainer.appendChild(container);
}

function applyMaxRoomCount() {
    $('.timetable-colheader', colHeader => {
        colHeader.style.width = ((maxRoomCount * 208) + 50 + 80) + 'px';
        for (var i = 1; i <= maxRoomCount; i++) {
            var headerCol = document.createElement('div');
            headerCol.textContent = i;
            colHeader.appendChild(headerCol);
        }
    });
    $('.row', row => {
        row.style.width = ((maxRoomCount * 208) + 50 + 80) + 'px';
    });
}

function updateAllRow() {
    objKeysEach(rooms_datetime, date => {
        objKeysEach(rooms_datetime[date], hour => {
            objKeysEach(rooms_datetime[date][hour], minute => {
                updateRow(date, hour, minute);
            });
        });
    })
}

function updateRow(date, hour, minute) {
    var rowId = 'row' + date + fmtTime('hm', +hour, +minute);
    var row = window[rowId];
    if (!row) return;

    var roomCount = window[rowId + 'RoomCount'];
    var roomIds = objKeys(rooms_datetime[date][hour][minute]);
    var myRoomCount = 0;
    $('.room', elm => elm.remove(), window[rowId]);
    roomCount.textContent = roomIds.length;
    roomIds.sort((a, b) => {
        if (rooms_id[a].members.includes(myAccountData.twitterScrName)) {
            return -1;
        }
        if (rooms_id[b].members.includes(myAccountData.twitterScrName)) {
            return 1;
        }
        if (myFriends.includes(rooms_id[a].owner)) {
            return -1;
        }
        if (myFriends.includes(rooms_id[b].owner)) {
            return 1;
        }
        return rooms_id[a].create_datetime - rooms_id[b].create_datetime;
    });

    var container = document.createDocumentFragment();
    roomIds.forEach(roomId => {
        if (rooms_id[roomId].owner === myAccountData.twitterScrName) {
            myRoomCount++;
        }
        appendRoom(rooms_id[roomId], container);
    });
    row.appendChild(container);

    upsertDataset(row, { roomCount, myRoomCount });
}

function appendRoom(data, container) {
    if (window[data.roomId]) return;

    var date = data.dateTime.format('ymd');
    var time = data.dateTime.format('hm');
    var row = container || window['row' + date + time];
    if (!row) return;

    var ownerAvatarTitle = '作成者：' + data.owner.mingolName + '(@' + data.owner.twitterScrName + ')';
    var ownerAvatar = createElm({
        type: 'img',
        cssClassies: ['room-owner-avatar', data.owner],
        alt: ownerAvatarTitle,
        title: ownerAvatarTitle,
        src: accounts[data.owner].avatar,
    });
    var roomNo = createElm({
        cssClassies: 'room-no',
        textContent: '#' + ('00000' + data.no).slice(-6),
        children: ownerAvatar
    });
    var roomTitle = createElm({
        cssClassies: 'room-title',
        textContent: data.title
    });
    var course = createElm({
        cssClassies: 'course',
        textContent: courses[data.course].short + ' ' + data.hole + 'Hole'
    });
    var memgerCount = createElm({
        id: data.roomId + 'Count',
        textContent: '参加予定：0'
    });
    var room = createElm({
        id: data.roomId,
        cssClassies: 'room center',
        onclick: roomClick,
        dataset: { owner: data.owner, course: data.course, hole: data.hole },
        children: [roomTitle, course, memberCount, roomNo]
    });
    row.appendChild(room);

}

function roomClick(evt) {
    var data = rooms_id[this.id];
    roomViewDialog.classRemove('preview');
    if (myRooms[this.id]) {
        btnReserveRoom.hide();
        btnRoomEdit.show();
    } else {
        btnReserveRoom.show();
        btnRoomEdit.hide();
    }
    if (currentMode === 'add') {
        currentRoomData = {};
        Object.assign(currentRoomData, data);
        roomDialogShow(true);
    } else {
        message.textContent = data.title
    }
}

function checkCreateRoomLimit(dt) {
    var date = dt.format('ymd');
    var hour = dt.hour;
    var minute = dt.minute;
    var minuteCnt = 0;
    var hourCnt = 0;

    objKeysEach(rooms_datetime[date][hour][minute], roomId => {
        if (rooms_id[roomId].owner === myAccountData.twitterScrName) {
            minuteCnt++;
        }
    });
    objKeysEach(rooms_datetime[date][hour], minute => {
        objKeysEach(rooms_datetime[date][hour][minute], roomId => {
            if (rooms_id[roomId].owner === myAccountData.twitterScrName) {
                hourCnt++;
            }
        });
    });
    if (minuteCnt >= MAX_PAR_MINUTE) {
        window['btnCreateRoom' + date + hour + minute].hide();
    }
    if (hourCnt >= MAX_PAR_HOUR) {
        $('[id^="btnCreateRoom' + date + hour + '"]', elm => elm.hide());
    }
}

function roomDialogShow(isView) {
    var roomId = currentRoomData.roomId;
    var dt = currentRoomData.dateTime;
    var title = currentRoomData.title || '';
    var course = currentRoomData.course;
    var hole = currentRoomData.hole;
    var comment = currentRoomData.comment || '';
    var owner = currentRoomData.owner;

    roomViewOwnerAvatar.src = accounts[owner].avatar;
    roomViewSummary.textContent = [
        dt.format('y/m/d h:m'),
        courses[course].short,
        hole + 'Hole'
    ].join(' ');

    if (isView) {
        lblPreview.hide();
        [btnReserveRoom, btnReserveList, btnRoomViewDialogClose].show();

        roomViewTitle.textContent = title;
        roomViewOwnerAvatar.src = accounts[owner].avatar;
        roomViewOwnerAvatar.alt = roomViewOwnerAvatar.title = accounts[owner].mingolName + '(@' + accounts[owner].twitterScrName + ')';
        roomViewComment.innerHTML = marked(comment.replace(/\n/g, '  \n'));

        updateMemberList(currentRoomData.members);
        dialogShow(roomViewDialog);
    } else {
        [btnRoomEdit, btnReserveRoom, btnReserveList, btnRoomViewDialogClose].hide();
        lblPreview.show();

        roomTemplates.innerHTML = '';
        objKeysEach(myRoomTemplates, templateName => {
            var opt = document.createElement('opt');
            opt.value = opt.textContent = templateName;
            roomTemplates.appendChild(opt);
        });
        roomStartDate.textContent = dt.format('y/m/d');
        roomStartTime.textContent = dt.format('h:m');
        regRoomTitle.value = '';
        regRoomCourse.value = 'tokyo';
        regRoomHole.value = '3';
        regRoomNo.value = '';
        regRoomComment.value = '';

        dialogShow(roomDialog);
    }
}

function updateMember(data, isReserve) {
    var roomId = msg.reserveRoom.roomId;
    var twitterScrName = msg.reserveRoom.twitterScrName;
    var room = rooms_id[msg.reserveRoom.roomId];
    var idx = room.members.indexOf(twitterScrName);
    if (idx === -1 && isReserve) {
        room.members.push(twitterScrName);
    } else if (idx !== -1 && !isReserve) {
        room.members.splice(idx, 1);
    }
    if (isShowing(roomViewDialog) && currentRoomData.roomId === roomId) {
        updateMemberList(room.members);
    }
}

function updateMemberList(members) {
    memberList.innerHTML = '';
    memberCount.textContent = members.length;
    if (members) {
        members.forEach(memberId => {
            var accountData = accounts[memberId];
            var member = document.createElement('div');
            var memberAvatar = document.createElement('img');
            var memberMingolName = document.createElement('span');
            var memberTwitterScrName = document.createElement('span');

            member.classAdd('member');
            memberAvatar.classAdd('member-avatar', memberId);
            memberMingolName.classAdd('member-mingolname');
            memberTwitterScrName.classAdd('member-twitterscrname');

            if (accountData.avatar) {
                memberAvatar.src = accountData.avatar;
            }
            memberMingolName.textContent = accountData.mingolName;
            memberTwitterScrName.textContent = '(@' + accountData.twitterScrName + ')';

            member.appendChildren(memberAvatar, memberMingolName, memberTwitterScrName);
            memberList.appendChild(member);
        });
    }
}

function upsertRoomData(data, withUpdateRow = true, send = true) {
    var roomId = data.roomId;
    var date = data.format('ymd');
    var hour = data.hour;
    var minute = data.minute;
    var owner = data.owner;

    rooms_id[roomId] = rooms_id[roomId] || data;

    if (owner === myAccountData.twitterScrName) {
        myRooms[roomId] = data;
        if (send) {
            dispatchCustomEvent('send', { rooms: { [roomId]: data } });
        }
    }

    rooms_datetime[date] = rooms_datetime[date] || {};
    rooms_datetime[date][hour] = rooms_datetime[date][hour] || {};
    rooms_datetime[date][hour][minute] = rooms_datetime[date][hour][minute] || {};
    rooms_datetime[date][hour][minute][roomId] = rooms_datetime[date][hour][minute][roomId] || data;

    rooms_owner[owner] = rooms_owner[owner] || {};
    rooms_owner[owner][roomId] = rooms_owner[owner][roomId] || data;

    if (withUpdateRow) {
        updateRow(date, hour, minute);
    }
    checkCreateRoomLimit(data);
}

function deleteRoom(roomId, withUpdateRow = true) {
    var data = rooms_id(roomId);
    var date = data.format('ymd');
    var hour = data.hour;
    var minute = data.minute;
    var owner = data.owner;

    if (rooms_id[roomId]) {
        delete rooms_id[roomId];
    }
    if (rooms_datetime[date] &&
        rooms_datetime[date][hour] &&
        rooms_datetime[date][hour][minute] &&
        rooms_datetime[date][hour][minute][roomId]) {
        delete rooms_datetime[date][hour][minute][roomId];
    }
    if (rooms_owner[owner] && rooms_owner[owner][roomId]) {
        delete rooms_owner[owner][roomId];
    }

    if (withUpdateRow) {
        updateRow(date, hour, minute);
    }
}

function deleteOldMyRoom(dt) {
    var year = dt.year;
    var month = dt.month;
    var day = dt.day;
    var hour = dt.hour;
    var minute = dt.minute;
    var myRoomArray = [];

    objKeysEach(myRooms, roomId => {
        myRoomArray.push(myRooms[roomId]);
    });
    myRoomArray.sort((a, b) => {
        var aDate = new IntervalDate(a.year, a.month - 1, a.day, a.hour, a.minute);
        var bDate = new IntervalDate(b.year, b.month - 1, b.day, b.hour, b.minute);
        return aDate.getTime() - bDate.getTime();
    });

    var idx = 0;
    for (var l = myRoomArray.length; idx < l; idx++) {
        if (year === myRoomArray[idx].datetime.year &&
            month === myRoomArray[idx].datetime.month &&
            day === myRoomArray[idx].datetime.day &&
            hour === myRoomArray[idx].datetime.hour &&
            minute === myRoomArray[idx].datetime.minute) {
            break;
        }
    }
    myRoomArray.splice(i, idx);
    myRooms = {};
    for (var i = 0, l = myRoomArray.length; i < l; i++) {
        upsertRoomData(myRoomArray, false, false);
    }
}

function clearRoomData() {
    myRooms = {};
    rooms_id = {};
    rooms_datetime = {};
    rooms_owner = {};
}

function getMaxRoomCount() {
    maxRoomCount = 0;
    objKeysEach(rooms_datetime, date => {
        objKeysEach(rooms_datetime[date], hour => {
            objKeysEach(rooms_datetime[date][hour], minute => {
                maxRoomCount = Math.max(maxRoomCount, objKeys(rooms_datetime[date][hour][minute]).length);
            });
        });
    });
}

function createRegAccountKey() {
    accountKey = UUID.generate().replace(/\{|\}|-/g, '').substr(0, 20);
    accountKeyDisp.textContent = accountKey;
}

function regAccount() {
    validateAccountKey().then(_ => {
        dispatchCustomEvent('regAccount');
    }).catch(err => {
        regAccountErrorMessage.textContent = err;
        btnRegAccount.show();
    });
}

function validateAccountKey() {
    return fetch('https://twitter.com/' + regTwitterScrName.value).then(res => {
        return new Promise((resolve, reject) => {
            if (res.ok) {
                resolve(res.text());
            } else {
                reject('入力したTwitterのスクリーンネーム ' + regTwitterScrName.value + ' は存在しないようです。入力したTwitterのスクリーンネームを確認してください。');
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
                        var elmAvatar = dom.querySelector('.ProfileAvatar-image');
                        myAvatar = elmAvatar.src;
                        resolve();
                    } else {
                        reject('認証キーが一致しません。Twitterで変更した名前と上記の認証キーが一致しているか確認してください。');
                    }
                } else {
                    reject('Twitterのページデザインが変更になった等により、ページのパースに失敗しアカウント登録が行えません。');
                }
            } catch (e) {
                reject('Twitterのページをパースするときにエラーが発生しアカウント登録が行えません。');
            }
        });
    });
}

window.addEventListener('regAccountSuccess', evt => {
    var isStart = !myAccountData;
    myAccountData = {
        mingolName: regMingolName.value,
        twitterScrName: regTwitterScrName.value,
        avatar: myAvatar
    };
    regMingolName.value = '';
    regTwitterScrName.value = '';
    accountAvatar.src = myAvatar;
    accountAvatar.show();
    saveStorage({ myAccountData }).then(_ => {
        dialogHide(accountDialog);
        btnRegAccount.show();
        messageDialogShow('アカウントを登録しました。忘れずにTwitterの名前をもとに戻してください。');
        if (btnRegAccount.dataset.type === 'step') {
            dispatchCustomEvent('connect', { myAccountData, myRooms });
            accountAvatar.src = myAccountData.avatar;
            accountAvatar.show();
            mingoroomContainer.innerHTML = '';
            appendTimetableRow(new IntervalDate());
        }
    });
});
window.addEventListener('dc_msg', evt => {
    var msg = evt.detail;
    if (msg.account) {
        console.log('receive accountData from "' + msg.from + '"', msg.account);
        accounts[msg.account.twitterScrName] = msg.account;
        connectCount.textContent = objKeys(accounts).length;
    }
    if (msg.connectTwitterSrcName) {
        onlineAccounts[msg.connectTwitterSrcName] = true;
        connectCount.textContent = objKeys(onlineAccounts).length;
    }
    if (msg.disconnectTwitterSrcName) {
        delete onlineAccounts[msg.disconnectTwitterSrcName];
        connectCount.textContent = objKeys(onlineAccounts).length;
    }
    if (msg.rooms) {
        console.log('receive rooms from "' + msg.from + '"', msg.rooms);
        objKeysEach(msg.rooms, roomId => {
            upsertRoomData(msg.rooms[roomId]);
        });
    }
    if (msg.roomTemplates) {
        Object.assign(roomTemplates, msg.roomTemplates);
    }
    if (msg.deleteRoomId) {
        deleteRoom(msg.deleteRoomId);
    }
    if (msg.reserveRoom) {
        updateMember(msg.reserveRoom, true);
    }
    if (msg.cancelRoom) {
        updateMember(msg.cancelRoom);
    }
});
