function tt() {
    var d = document,
    z = d.createElement('scr' + 'ipt'),
    c = d.createElement('link'),
    b = d.body;
    
    z.setAttribute('src', 'http://typekit-tweaker.s3.amazonaws.com/tt.js');
    
    c.setAttribute('href', 'http://typekit-tweaker.s3.amazonaws.com/tt.css');
    c.setAttribute('rel', 'stylesheet');
    
    try {
        if (!b) throw (0);
        d.head.appendChild(c);
        z.onload = function() {
          window.tt.tweaker = new tt.Tweaker($('.specimen-editor textarea'));
        };
        b.appendChild(z);
    } catch(e) {
        alert('Please wait until the page has loaded.');
    }
};
tt();
void(0);