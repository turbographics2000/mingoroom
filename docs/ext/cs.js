
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
        var year = nowYear();
        var month = nowMonth();
        var day = nowDay();
        tutorialMask.style.background = 'rgba(0,0,0,0.01)';
        if (stepNo === 3) {
            accountAvatar.show();
            appendTimetableRow(year, month, day);
        } else if (stepNo === 4) {
            accounts = demoAccounts;
            createDemoRoom(year, month, day);
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
            appendTimetableRow(nowYear(), nowMonth(), nowDay());
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
            if(myAccountData) {
                accounts[myAccountData.twitterScrName] = myAccountData;
                accountAvatar.src = myAccountData.avatar;
                accountAvatar.show();
            }
            appendTimetableRow(nowYear(), nowMonth(), nowDay());
            myRooms = data.myRooms;
            myFriends = data.myFriends || {};
            deleteOldMyRoom();            
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

function createDemoRoom(year, month, day, hour, minute) {
    for (var i = 0; i < 144; i++) {
        var hour = i / 6 | 0;
        var minute = (i % 6) * 10;
        var time = zs2(hour) + zs2(minute);
        var roomCount = Math.random() * 5 | 0;
        var course = objKeys(courses)[Math.random() * 6 | 0];

        for (var r = 0; r < roomCount; r++) {
            var roomId = UUID.generate();//'room' + (rid++); 
            var data = {
                roomId: UUID.generate(),
                hour,
                minute,
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
    if(evt.srcElement instanceof HTMLTextAreaElement) return;
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
        appendTimetableRow(nowYear(), nowMonth(), nowDay());
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
    data.dt = data.dt || new Date(data.year, data.month, data.day, data.hour, data.minute);
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
btnReserveList.onclick = function() {
    
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
btnRegTemplate.onclick = function() {
    var templateName = txtTemplateName.value.trim();
    if(templateName) {
        myRoomTemplates[templateName] = {
            title: regRoomTitle.value,
            course: regRoomCourse.value,
            hole: regRoomHole.value,
            roomNo: regRoomNo.value,
            comment: regRoomComment.value
        };
    }
};
btnReserveRoom.onclick = function() {

};

regRoomCourse.onchange = regRoomHole.onchange = function(evt) {
    var year = currentRoomData.year;
    var month = currentRoomData.month;
    var day = currentRoomData.day;
    var hour = currentRoomData.hour;
    var minute = currentRoomData.minute;

    roomViewSummary.textContent = [
        fmt('y/m/d h:m', year, month, day, hour, minute),
        courses[regRoomCourse.value].short,
        regRoomHole.value + 'Hole'
    ].join(' ');
}
regRoomComment.oninput = function() {
    roomViewComment.innerHTML = marked(this.value.replace(/\n/g, '  \n'));
}

function requireInput() {
    if (this.value) {
        this.classAdd('hasvalue');
    } else {
        this.classRemove('hasvalue');
    }
    if(this.id === 'regRoomTitle') {
        roomViewTitle.textContent = this.value;
    } else if(this.id === 'regRoomNo') {
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


function appendTimetableRow(year, month, day) {
    var dateRow = document.createElement('div');
    var colHeader = document.createElement('div');
    dateRow.className = 'timetable-daterow center';
    dateRow.textContent = fmtDate('y/m/d', year, month, day);

    colHeader.className = 'timetable-colheader border-bottom center';
    // colHeader.style.width = ((maxRoomCount * 208) + 50 + 80) + 'px';
    // for(var i = 1; i <= maxRoomCount; i++) {
    //     var headerCol = document.createElement('div');
    //     headerCol.textContent = i;
    //     appendChild(colHeader, headerCol);
    // }
    mingoroomContainer.appendChildren([dateRow, colHeader]);
    var startHour = 0;
    var startMinute = 0;

    if (year === nowYear() && month === nowMonth() && day === nowDay()) {
        startHour = nowHour();
        startMinute = ((nowMinute() + 9) / 10 | 0) * 10;
    }

    var container = document.createDocumentFragment();

    for (var hour = startHour; hour < 24; hour++) {
        for (var minute = hour === startHour ? startMinute : 0; minute < 60; minute += 10) {
            var ymdhm = fmt('ymdhm', year, month, day, hour, minute);
            var rowId = 'row' + ymdhm;
            if (window[rowId]) continue;

            var row = document.createElement('div');
            var rowHeader = document.createElement('div');
            var rowTime = document.createElement('div');
            var roomCountContainer = document.createElement('div');
            var roomCount = document.createElement('span');
            var roomCountLabel = document.createElement('span');
            var btnCreateRoom = document.createElement('div');
            var btnDelete = document.createElement('div');

            row.id = rowId;
            btnCreateRoom.id = 'btnCreateRoom' + ymdhm;
            // row.style.width = ((maxRoomCount * 208) + 50 + 80) + 'px';
            roomCount.id = row.id + 'RoomCount';
            roomCount.textContent = '0';
            roomCountLabel.textContent = '室';
            rowTime.textContent = fmtTime('h:m', hour, minute);
            row.classAdd('row');
            rowHeader.classAdd('rowheader', 'center');
            rowTime.classAdd('timetable-time');
            roomCountContainer.classAdd('timetable-roomcount');
            btnCreateRoom.classAdd('create-room-button', 'center');
            if (currentMode === 'delete') {
                btnCreateRoom.hide();
            }

            upsertDataset(btnCreateRoom, { roomCount: 0, year, month, day, hour, minute });
            btnCreateRoom.onclick = function (evt) {
                currentRoomData = {
                    year: +this.dataset.year,
                    month: +this.dataset.month,
                    day: +this.dataset.day,
                    hour: +this.dataset.hour,
                    minute: +this.dataset.minute,
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

            roomCountContainer.appendChildren(roomCount, roomCountLabel);
            rowHeader.appendChildren(rowTime, roomCountContainer, btnCreateRoom);
            row.appendChildren(rowHeader);
            container.appendChild(row);
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
        if(myFriends.includes(rooms_id[a].owner)) {
            return -1;
        }
        if(myFriends.includes(rooms_id[b].owner)) {
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

    var date = fmtDate('ymd', data.year, data.month, data.day);
    var time = fmtTime('hm', data.hour, data.minute);
    var row = container || window['row' + date + time];
    if (!row) return;

    var room = document.createElement('div');
    var roomTitle = document.createElement('div');
    var course = document.createElement('div');
    var hole = document.createElement('div');
    var ownerAvatar = document.createElement('img');
    var roomNo = document.createElement('div');
    var memberCount = document.createElement('div');

    room.id = data.roomId;
    memberCount.id = data.roomId + 'Count';

    room.classAdd('room', 'center');
    roomTitle.classAdd('room-title');
    roomNo.classAdd('room-no');
    course.classAdd('course');
    ownerAvatar.classAdd('room-owner-avatar', data.owner);

    roomTitle.textContent = data.title;
    roomNo.textContent = '#' + ('00000' + data.no).slice(-6);
    course.textContent = courses[data.course].short + ' ' + data.hole + 'Hole';
    ownerAvatar.alt = ownerAvatar.title = '作成者：' + data.owner.mingolName + '(@' + data.owner.twitterScrName + ')';
    ownerAvatar.src = accounts[data.owner].avatar;
    memberCount.textContent = '参加予定：0';

    upsertDataset(room, { owner: data.owner, course: data.course, hole: data.hole });
    room.onclick = function (evt) {
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
    };

    roomNo.appendChild(ownerAvatar);
    room.appendChildren(roomTitle, course, memberCount, roomNo);
    row.appendChild(room);
}

function checkCreateRoomLimit({ year, month, day, hour, minute }) {
    var date = fmtDate('ymd', year, month, day);
    hour = zs2(hour);
    minute = zs2(minute);
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
    var year = currentRoomData.year;
    var month = currentRoomData.month;
    var day = currentRoomData.day;
    var hour = currentRoomData.hour;
    var minute = currentRoomData.minute;
    var title = currentRoomData.title || '';
    var course = currentRoomData.course;
    var hole = currentRoomData.hole;
    var comment = currentRoomData.comment || '';
    var owner = currentRoomData.owner;

    roomViewOwnerAvatar.src = accounts[owner].avatar;
    roomViewSummary.textContent = [
        fmt('y/m/d h:m', year, month, day, hour, minute),
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
        roomStartDate.textContent = fmtDate('y/m/d', year, month, day);
        roomStartTime.textContent = fmtTime('h:m', hour, minute);
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
    var date = fmtDate('ymd', data.year, data.month, data.day);
    var hour = zs2(data.hour);
    var minute = zs2(data.minute);
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
    var date = fmtDate(data.year, data.month, data.day);
    var hour = zs2(data.hour);
    var minute = zs2(data.minute);
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

function deleteOldMyRoom() {
    var year = nowYear();
    var month = nowMonth();
    var day = nowDay();
    var hour = nowHour();
    var minute = ((nowMinute() + 9) / 10 | 0) * 10;
    var myRoomArray = [];

    objKeysEach(myRooms, roomId => {
        myRoomArray.push(myRooms[roomId]);
    });
    myRoomArray.sort((a, b) => {
        var aDate = new Date(a.year, a.month, a.day, a.hour, a.minute);
        var bDate = new Date(b.year, b.month, b.day, b.hour, b.minute);
        return aDate.getTime() - bDate.getTime();
    });

    var idx = 0;
    for (var l = myRoomArray.length; idx < l; idx++) {
        if (year === myRoomArray[idx].year &&
            month === myRoomArray[idx].month &&
            day === myRoomArray[idx].day &&
            hour === myRoomArray[idx].hour &&
            minute === myRoomArray[idx].minute) {
            break;
        }
    }
    myRoomArray.splice(i, idx);
    myRooms = {};
    for(var i = 0, l = myRoomArray.length; i < l; i++) {
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
            appendTimetableRow(nowYear(), nowMonth(), nowDay());
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
    if(msg.roomTemplates) {
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
