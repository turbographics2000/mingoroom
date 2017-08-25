var step = localStorage.getItem('step') || 'extNotInstalled';
var extId = 'ioaancmfccbkoknfeibefmdahkpiincg';
//var extId = 'ioaancmfccbkoknfeibefmdahkpiinch';

btnExtInstall.onclick = btnExtInstall2.onclick = function() {
    step = 'installButtonClicked';
    localStorage.setItem('step', step);
    var win = window.open('https://chrome.google.com/webstore/detail/gellpinfkckcbeebkhanmfkfgihelpfm/publish-delayed?hl=ja', '_blank');
    win.focus();
};

chrome.runtime.sendMessage(extId, {installCheck: true}, res => {
    // インストールされていない場合は
    // res=undefined
    // になる
    if(res) {
        step = 'extInstalled';
        localStorage.setItem('step', step);
    } else {
        if(step === 'extNotInstalled') {
            welcomDialog.classList.remove('hide');
        }else if(step === 'installButtonClicked') {
            extNotInstalledDialog.classList.remove('hide');
        }
    }
});