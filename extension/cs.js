fetch('https://twitter.com/gtk2k').then(res => res.text()).then(txt => {
    var parser = new DOMParser();
    var dom = parser.parseFromString(txt, 'text/html');
    var elmTwitterName = dom.querySelector('.ProfileHeaderCard-name');
});