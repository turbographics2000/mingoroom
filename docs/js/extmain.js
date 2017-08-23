//var extId = 'ioaancmfccbkoknfeibefmdahkpiincg';
var extId = 'ioaancmfccbkoknfeibefmdahkpiinch';
chrome.runtime.sendMessage(extId, {installCheck: true}, (res) => {
    console.log(res);
});