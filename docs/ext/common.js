HTMLElement.prototype.appendChildren = function(...children) {
    if(!children) return;
    for(var i = 0, l = children.length; i < l; i++) {
        if(!(children[i] instanceof HTMLElement)) return; 
    }
    children.forEach(elm => {
        this.appendChild(elm);
    });
}
HTMLElement.prototype.hasClass = function(cls) {
    return this.classList.contains(cls);
};
HTMLElement.prototype.isShowing = function() {
    return !this.hasClass('hide');
};
Array.prototype.classAdd = 
NodeList.prototype.classAdd = 
HTMLCollection.prototype.classAdd = 
HTMLElement.prototype.classAdd = function(classies) {
    if(!classies) return;
    if(Array.isArray(this)) {
        for(var i = 0, l = this.length; i < l; i++) {
            if(!(this[i] instanceof HTMLElement)) return; 
        }
    }
    if(!Array.isArray(classies)) classies = [classies];
    var elms = this instanceof HTMLElement ? [this] : this;
    classies.forEach(cls => {
        elms.forEach(elm => {
            elm.classList.add(cls);
        });
    });
};
Array.prototype.classRemove = 
NodeList.prototype.classRemove = 
HTMLCollection.prototype.classRemove = 
HTMLElement.prototype.classRemove = function(classies) {
    if(!classies) return;
    if(Array.isArray(this)) {
        for(var i = 0, l = this.length; i < l; i++) {
            if(!(this[i] instanceof HTMLElement)) return; 
        }
    }
    if(!Array.isArray(classies)) classies = [classies];
    var elms = this instanceof HTMLElement ? [this] : this;
    classies.forEach(cls => {
        elms.forEach(elm => {
            elm.classList.remove(cls);
        });
    });
};
Array.prototype.show = 
NodeList.prototype.show = 
HTMLCollection.prototype.show = 
HTMLElement.prototype.show = function() {
    this.classRemove('hide');
};
Array.prototype.hide = 
NodeList.prototype.hide = 
HTMLCollection.prototype.hide = 
HTMLElement.prototype.hide = function() {
    this.classAdd('hide');
};

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

function $(selector, func, parent) {
    (parent || document).querySelectorAll(selector).forEach(func);
};
/*function classAdd(elm, ...cls) {
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
    if(elm) {
        let elms = null;
        if(elm instanceof HTMLElement) elms = [elm];
        elms.forEach(elm => {
            elm.show();
        })
    }
}
function elmHide(elm) {
    if(elm) {
        let elms = null;
        if(elm instanceof HTMLElement) elms = [elm];
        if(Array.isArray(elms) || elms instanceof NodeList || elms instanceof HTMLCollection) {
            elms.forEach(elm => {
                classAdd(elm, 'hide');
            });
        }
    }
}
function appendChild(parent, ...child) {
    arrayEach(child, elm => parent.appendChild(elm));
}
*/
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
    if(!obj) return;
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

