function isElementArray() {
    if (Array.isArray(this)) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (!(this[i] instanceof HTMLElement)) return false;
        }
    }
    return true;
}
function classAdd(...classies) {
    if (!classies) return;
    if (Array.isArray(this) && !isElementArray) return;
    var elms = this instanceof HTMLElement ? [this] : this;
    classies.forEach(cls => {
        elms.forEach(elm => {
            elm.classList.add(cls);
        });
    });
}
function classRemove(...classies) {
    if (!classies) return;
    if (Array.isArray(this) && !isElementArray) return;
    var elms = this instanceof HTMLElement ? [this] : this;
    classies.forEach(cls => {
        elms.forEach(elm => {
            elm.classList.remove(cls);
        });
    });
}
function show() {
    this.classRemove('hide');
}
function hide() {
    this.classAdd('hide');
}
function calcDate({ target, y = 0, m = 0, d = 0, h = 0, min = 0 }) {
    var dt = new Date(dt.getFullYear() + y, dt.getMonth() + m, dt.getDate() + d, dt.getHours() + h, dt.getMinutes() + min);
    target.setTime(+dt);
}
function newDt({ src, y = 0, m = 0, d = 0, h = 0, min = 0 }) {
    return new Date(src.getFullYear() + y, src.getMonth() + m, src.getDate() + d, src.getHours() + h, src.getMinutes() + min);
}
Object.defineProperties(HTMLElement.prototype, {
    appendChildren: function (...children) {
        if (!children) return;
        for (var i = 0, l = children.length; i < l; i++) {
            if (!(children[i] instanceof HTMLElement)) return;
        }
        children.forEach(elm => {
            this.appendChild(elm);
        });
    },
    hasClass: function (cls) {
        return this.classList.contains(cls);
    },
    isShowing: function () {
        return !this.hasClass('hide');
    },
    classAdd: classAdd,
    classRemove: classRemove,
    show: show,
    hide: hide
});
Object.defineProperties(Array.prototype, {
    classAdd: classAdd,
    classRemove: classRemove,
    show: show,
    hide: hide
});
Object.defineProperties(NodeList.prototype, {
    classAdd: classAdd,
    classRemove: classRemove,
    show: show,
    hide: hide
});
Object.defineProperties(HTMLCollection.prototype, {
    classAdd: classAdd,
    classRemove: classRemove,
    show: show,
    hide: hide
});

class IntervalDate {
    constructor(_interval) {
        this._interval = _interval || 10;
        this._dt = new Date();
    }

    get interval() {
        return this._interval;
    }
    set interval(value) {
        this._interval = value;
    }
    
    get year () {
        return '' + this.getFullYear();
    }
    set year(value) {
        this.setTime(+newDt({ src: this, y: +value }));
    }
    
    get month () {
        return zs2(this.getMonth());
    }
    set month (value) {
        this.setTime(+newDt({ src: this, m: +value }));
    }
    
    get day () {
        return zs2(this.getDate());
    }
    set day (value) {
        this.setTime(+newDt({ src: this, d: +value }));
    }
    
    get hour () {
        return zs2(this.getHours());
    }
    set hour (value) {
        this.setTime(+newDt({ src: this, h: +value }));
    }
    
    get minute () {
        return zs2(((this.getMinutes() + this.interval - 1) / dt.interval | 0) * dt.interval);
    }
    set minute (value) {
        this.setTime(+newDt({ src: this, min: +value }));
    }

    addMonths(value) {
        return calcDate({ target: this, m: value });
    }
    addDays(value) {
        return calcDate({ target: this, d: value });
    }
    addHours(value) {
        return calcDate({ target: this, h: value });
    }
    addMinutes(value) {
        return calcDate({ target: this, min: value });
    }
    format(formatString) {
        switch (formatString) {
            case 'y/m/d':
                return [this.getFullYear(), zs2(this.getMonth() + 1), zs2(this.getDate())].join('/');
            case 'ymd':
                return this.getFullYear() + zs2(this.getMonth() + 1) + zs2(this.getDate());
            case 'h:m':
                return zs2(this.getHours()) + ':' + zs2(this.getMinutes());
            case 'hm':
                return zs2(this.getHours()) + zs2(this.getMinutes());
            case 'y/m/d h:m':
                return this.fmt('y/m/d') + ' ' + this.fmt('h:m');
            case 'ymdhm':
                return this.fmt('ymd') + this.fmt('hm');
        }
    }
    loopTo(dt, func) {
        if(+this <= +dt) {
            func(this);
            this.addMinutes(this.interval);
        }
    }
    clone() {
        return new Date(+this);
    }
}

function createElm(data) {
    data.type = data.type || 'div';
    var elm = document.createElement(type);
    objKeys(data, key => {
        switch (key) {
            case 'cssClassies':
                if (!Array.isArray(data.cssClassies)) data.cssClassies = [data.cssClassies];
                data.cssClassies = data.cssClassies.split(' ');
                data.cssClassies.forEach(cssClass => {
                    elm.classList.add(cssClass);
                });
                break;
            case 'dataset':
                objKeysEach(data.dataset, key => {
                    elm.dataset[key] = data.dataset[key];
                });
                break;
            case 'children':
                elm.appendChildren(data.children);
                break;
            default:
                elm[key] = data[key];
                break;

        }
    });
    return elm;
}

function objRecursive(obj, func) {
    func(obj);
    objKeysEach(obj, key => {
        objRecursive(obj[key], func);
    });
}
function dateTimeSerialize(item) {
    if (item.dateTime) {
        item.dateTime = +item.dateTime;
    }
}
function dateTimeDeserialize(item) {
    if (item.dateTime) {
        item.dateTime = new Date(item.dateTime);
    }
}
function saveStorage(data) {
    return new Promise((resolve, reject) => {
        objRecursive(obj, dateTimeSerialize);
        chrome.storage.local.set(data, _ => {
            resolve();
        });
    });
}
function loadStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, val => {
            objRecursive(val, dateTimeDeserialize);
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

function $(selector, func, parent) {
    (parent || document).querySelectorAll(selector).forEach(func);
};

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
function objPropsEach(obj, func) {
    if (!obj) return;
    var keys = objKeys(obj);
    keys.forEach((key, idx) => {
        func(obj[key], key, idx);
    });
}
function upsertDataset(elm, dataset) {
    objKeysEach(dataset, key => elm.dataset[key] = dataset[key]);
}
function deleteDataset(elm, keys) {
    arrayEach(keys, key => delete elm.datase[key]);
}
/*
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
*/
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
/*function fmtDate(format, year, month, day) {
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
}*/
function dialogShow(dialog) {
    dialogMask.show();
    dialog.show();
    setCurrentDialog(dialog);
}
function dialogHide(dialog) {
    dialogMask.hide();
    dialog.hide();
    setCurrentDialog(dialog);
}
function dialogChangeTo(dialog) {
    $('.dialog', elm => {
        dialog.hide();
    });
    dialog.show();
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

