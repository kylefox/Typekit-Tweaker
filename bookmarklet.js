function tt() {
    var d = document,
    z = d.createElement('scr' + 'ipt'),
    c = d.createElement('link'),
    b = d.body;
    try {
        if (!b) throw (0);
        console.log("Loading script & CSS...");
        c.setAttribute('href', 'http://dl.dropbox.com/u/780754/typekit_tweaker/tt.css');
        c.setAttribute('rel', 'stylesheet');
        d.head.appendChild(c);
        z.setAttribute('src', 'http://dl.dropbox.com/u/780754/typekit_tweaker/tt.js');
        b.appendChild(z);
    } catch(e) {
        console.log('Please wait until the page has loaded.');
    }
}
tt();
void(0);