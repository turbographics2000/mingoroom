function saveStorage(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(data, _ => {
            resolve();
        });
    });
}
function loadStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, val => {
            resolve(val);
        });
    });
}

function dispatchCustomEvent(eventName, detail = null) {
    var evt = new CustomEvent(eventName, { detail });
    window.dispatchEvent(evt);
}
function sendData(data, to = null) {
    dispatchCustomEvent('send', { data, to });
}

function arrayEach(data, func) {
    if (Array.isArray(data)) {
        arr = data;
    } else {
        arr = [data];
    }
    arr.forEach(func);
}
function $(selector, func, parent) {
    (parent || document).querySelectorAll(selector).forEach(func);
};
function classAdd(elm, ...cls) {
    if (!elm || !(elm instanceof HTMLElement)) return;
    elm.classList.add(...cls);
}
function classRemove(elm, ...cls) {
    if (!elm || !(elm instanceof HTMLElement)) return;
    elm.classList.remove(...cls);
}
function hasClass(elm, cls) {
    return elm.classList.contains(cls);
}
function isShowing(elm) {
    return !hasClass(elm, 'hide');
}
function elmShow(elm) {
    if (!elm || !(elm instanceof HTMLElement)) return;
    classRemove(elm, 'hide');
}
function elmHide(elm) {
    if (!elm || !(elm instanceof HTMLElement)) return;
    classAdd(elm, 'hide');
}
function appendChild(parent, ...child) {
    arrayEach(child, elm => parent.appendChild(elm));
}
function objKeys(obj, idx = null) {
    if (!obj) return;
    if (idx !== null) {
        return Object.keys(obj)[idx];
    } else {
        return Object.keys(obj);
    }
}
function objKeysEach(obj, func) {
    if (!obj) return;
    objKeys(obj).forEach(func);
}
function upsertDataset(elm, dataset) {
    objKeysEach(dataset, key => elm.dataset[key] = dataset[key]);
}
function deleteDataset(elm, keys) {
    arrayEach(keys, key => delete elm.datase[key]);
}
function nowYear() {
    return (new Date()).getFullYear();
}
function nowMonth() {
    return (new Date()).getMonth() + 1;
}
function nowDay() {
    return (new Date()).getDate();
}
function nowHour() {
    return (new Date()).getHours();
}
function nowMinute() {
    return (new Date()).getMinutes();
}
function zs2(val) {
    return ('0' + (+val)).slice(-2);
}
function zs4(val) {
    return ('000' + (+val)).slice(-4);
}
function fmt(format, year, month, day, hour, minute) {
    switch (format) {
        case 'y/m/d h:m':
            return fmtDate('y/m/d', year, month, day) + ' ' + fmtTime('h:m', hour, minute);
        case 'ymdhm':
            return fmtDate('ymd', year, month, day) + fmtTime('hm', hour, minute);
    }
}
function fmtDate(format, year, month, day) {
    switch (format) {
        case 'y/m/d':
            return [year, zs2(month), zs2(day)].join('/');
        case 'ymd':
            return year + zs2(month) + zs2(day);
    }
}
function fmtTime(format, hour, minute) {
    switch (format) {
        case 'h:m':
            return [zs2(hour), zs2(minute)].join(':');
        case 'hm':
            return zs2(hour) + zs2(minute);
    }
}
function dialogShow(dialog) {
    elmShow(dialogMask);
    elmShow(dialog);
    setCurrentDialog(dialog);
}
function dialogHide(dialog) {
    elmHide(dialogMask);
    elmHide(dialog);
    setCurrentDialog(dialog);
}
function dialogChangeTo(dialog) {
    $('.dialog', elm => elmHide(dialog));
    elmShow(dialog);
    setCurrentDialog(dialog);
}
function setCurrentDialog(dialog) {
    currentDialog = dialog;
    currentOKButton = dialog.querySelector('.ok-button');
    currentCancelButtn = dialog.querySelector('.cancel-button');
}
function messageDialogShow(msg) {
    dlgMessage.textContent = msg;
    dialogShow(messageDialog);
}