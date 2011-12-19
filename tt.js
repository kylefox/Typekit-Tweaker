(function() {
  
  var Keys = {
    UP: 38, DOWN: 40, 
  }
  
  $.log = function(msg) {
    if(console && typeof console.log === 'function') {
      console.log('TT: ' + msg);
    }
  };
  
  window.tt = {
    VERSION: 0.1,
    DEFAULTS: {'line-height': '1.50em', 'font-size': '16px', color: '#444444', background: '#FFFFFF', 'letter-spacing': '0px'},
    LOREM: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    ADJUST_LIGHTNESS: 0.2
  };
  
  
  tt.Color = {
    
    // Converts "#444" or "#FF0099" into an RGB object.
    parseRGB: function(hexString) {
      hexString = hexString.replace('#', '');
      var r, g, b;
      if(hexString.length === 3) {
        r = hexString[0] + hexString[0];
        g = hexString[1] + hexString[1];
        b = hexString[2] + hexString[2];
      } else if(hexString.length === 6) {
        r = hexString.substring(0, 2);
        g = hexString.substring(2, 4);
        b = hexString.substring(4, 6);
      } else {
        r = g = b = 0;
      }
      return {
        r: Math.round(parseInt(r, 16)),
        g: Math.round(parseInt(g, 16)),
        b: Math.round(parseInt(b, 16))
      };
    },
    
    // Takes an RGB object and converts it into a hex string.
    rgbToHex: function(color) {
      var f = function(n) {
        var s = Math.round(n).toString(16);
        if(s.length === 1) s = "0" + s;
        return s;
      };
      return ("#" + f(color.r) + f(color.g) + f(color.b)).toUpperCase();
    },
    
    // Brightens or darkens a color.
    adjustLightness: function(color, factor) {
      var f = function(n) {
        var r = (n * factor > 255) ? 255 : (n * factor);
        return (factor < 1) ? Math.floor(r) : Math.ceil(r);
      };
      return {
        r: f(color.r),
        g: f(color.g),
        b: f(color.b)
      };    
    }
  };
  
  
  
  tt.Tweaker = function(element) {
    var self = this,
        _txt = $(element),
        _settings,
        _toolbar,
        _controls;

    
    /************************************************************************
    *** Private */
    
    // Updates the font-size input with the textarea's actual font-size.
    function updateFontSize(event) {
      _controls.filter('[name="font-size"]').val(_txt.css('font-size'));
    };
    
    function createControl(attr) {
      return '<div class="widget"><label for="tt-' + attr + '">' + attr.replace('-', ' ') + '</label><input type="text" name="' + attr + '" id="tt-' + attr + '" /></div>';
    }
    
    function _refresh(event) {
      self.refresh();
    }
    
    function spinColor(input, lighten) {
      var color = tt.Color.parseRGB(input.val());
      if(color.r === 0 && color.g === 0 && color.b === 0 && lighten) {
        color = {r: 1, g: 1, b: 1};
      }
      var adjusted = tt.Color.adjustLightness(color, lighten ? 1+tt.ADJUST_LIGHTNESS : 1-tt.ADJUST_LIGHTNESS),
          hex = tt.Color.rgbToHex(adjusted);
      input.val(hex);
    };

    function spin(input, isUp) {
      var name = input.attr('name');
      if(name === 'color' || name === 'background') {
        spinColor(input, isUp);
      } else {
        var units = input.val().replace('.', '').replace(/-?\d+/, '') || 'px',
            amt = (units === 'px' ? 1 : 0.05),
            val = Number(input.val().slice(0, -2)),
            newVal = Number(isUp ? val+=amt : val-=amt);
        if(isNaN(newVal)) {
          newVal = 0;
        } else if(newVal <= 0 && name !== 'letter-spacing') {
          newVal = 0;
        }
        if(units === 'em') {
          newVal = newVal.toFixed(2);
        }
        input.val(newVal + units); 
      }
    };
    
    // Initializes everything (creates toolbar & binds events).
    function init() {
      var settings, saved = $.cookie('-tt-css');
      drawToolbar();
      bindEvents();
      if(saved) {
        try {
          settings = JSON.parse(saved);
        } catch(e) {
          $.log(e);
          settings = tt.DEFAULTS;
        }
      } else {
        settings = tt.DEFAULTS;
      }
      self.load(settings);
    }
    
    function drawToolbar() {
      var html = []; // Fastest way to construct & insert DOM elements. Gross, I know :(
      html.push('<div id="tt-tb">');
      html.push('<div class="lorem widget"><a href="#lorem" title="Insert sample text">L</a></div>');
      html.push(createControl('font-size'));
      html.push(createControl('line-height'));
      html.push(createControl('letter-spacing'));
      html.push(createControl('color'));
      html.push(createControl('background'));
      html.push('<div class="chk widget">');
      html.push('<p><input id="tt-smoothing" name="-webkit-font-smoothing" value="antialiased:subpixel-antialiased" type="checkbox" /><label for="tt-smoothing" title="Use antialiasing instead of subpixel-antialiasing (WebKit only)">Antialias</label></p>');
      // html.push('<p><input id="tt-small-caps" name="font-variant" value="small-caps:normal" type="checkbox" /><label for="tt-small-caps" title="Turn on small-caps">Small caps</label></p>');
			html.push('<a href="http://kylefox.ca/typekit-tweaker/" title="Typekit Tweaker, Version ' + window.tt.VERSION + '">About</a>');
      html.push('</div>');
      html.push('</div>');
      _toolbar = $(html.join(''));
      _controls = _toolbar.find('input[type="text"]');
      _txt.before(_toolbar);
    };
    
    function bindEvents() {
      // Sample text button.
      _toolbar.find('a[href="#lorem"]').click(function() {
        var info = $.trim($('#aside .font-creator-bio .description').text());
        _txt.val(info || tt.LOREM);
        return false;
      });
      
      // Text inputs
      _controls.keydown(function(event) {
        if(event.keyCode === Keys.UP || event.keyCode === Keys.DOWN) {
          event.preventDefault();
          spin($(this), event.keyCode === Keys.UP);
        };
        self.refresh();
      }).change(_refresh).keyup(_refresh);
      
      // Checkboxes
      _toolbar.find('input[type="checkbox"]').click(_refresh);
      
      // Handle changes from TypeKit controls.
      $('.variation-switch').change(_refresh);
      $('.font-size-slider').bind('slide', updateFontSize);
    };
    
    
    /************************************************************************
    *** Public */
    
    this.load = function(settings) {
      _settings = settings;
      $.each(_settings, function(i, o) { _toolbar.find('[name="' + i + '"]').val(o); });
      this.refresh();
    };
    
    // Applies the settings to the textarea.
    this.refresh = function() {
      var css =  {};
      _controls.each(function(i, o) {
        css[this.name] = this.value;
      });
      _toolbar.find('input[type="checkbox"]').each(function(i, o) {
        css[this.name] = this.value.split(":")[this.checked ? 0 : 1];
      });
      _txt.css(css);
      $.cookie('-tt-css', JSON.stringify(css));
    };
    
    
    /************************************************************************
    *** GO! */
    init();
    $.log("Loaded!");
    $('#tt-font-size').select();
  };

})();