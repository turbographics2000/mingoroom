var extId = 'ioaancmfccbkoknfeibefmdahkpiincg';
//var extId = 'ioaancmfccbkoknfeibefmdahkpiinch';
chrome.runtime.sendMessage(extId, {installCheck: true}, (res) => {
    // インストールされていない場合は
    // res=undefined
    // になる
    console.log(res);
});