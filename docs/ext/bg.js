chrome.runtime.onMessageExternal.addListener((msg, sender, res) => {
    if(msg.installCheck) {
        res(true);
    }
});
