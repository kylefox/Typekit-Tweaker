// (function() {

  var txt = $('.specimen-editor textarea'),
      LOREM = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      toolbar,
      controls,
      currentSetting,
      defaultSetting = {'line-height': '1.50em', 'font-size': '16px', color: '#444', background: '#fff'};

  function updatePreview(event) {
    controls.each(function(i, o) {
      txt.css($(this).attr('name'), $(this).val());
    });
  };

  function updateFontSize(event) {
    controls.filter('[name="font-size"]').val(txt.css('font-size'));
  };

  function lorem() {
    var link = $('<a href="#lorem" title="Insert sample text">L</a>')
      .click(function() {
      txt.val(LOREM);
      return false;
    });
    return $('<div class="lorem widget" />').append(link);
  };

  function createControl(attr, label, val) {
    var i = $('<input type="text" name="' + attr + '" id="tt-' + attr + '" />')
            .keyup(updatePreview).change(updatePreview)
            .val(val),
        l = $('<label for="tt-' + attr + '">' + label + '</label>');
    return $('<div class="widget" />').append(l).append(i);
  }
  
  function createCheckbox(label, property, yesValue, noValue, help) {
    var chk = $('<input type="checkbox" >')
                .click(function(event) { txt.css(property, $(this).attr('checked') ? yesValue : noValue); })
                .attr('id', 'tt-' + property),
        lbl = '<label for="tt-' + property + '" title="' + help + '">' + label + '</label>';
    
    return $('<p></p>').append(chk).append(lbl);
  };

  function createToolbar() {
    var tb = $('<div id="tt-tb" />')
              .append(lorem())
              .append(createControl('line-height', 'Line height', txt.css('line-height')))
              .append(createControl('font-size', 'Font size', txt.css('font-size')))
              .append(createControl('color', 'Color', txt.css('color')))
              .append(createControl('background', 'Background', txt.css('background'))),
        chks = $('<div class="chk widget"></div>')
              .append(createCheckbox('Antialias', '-webkit-font-smoothing', 'antialiased', 'subpixel-antialiased', 'Toggle -webkit-font-smoothing: antialiased;'))
              .append(createCheckbox('Small caps', 'font-variant', 'small-caps', 'normal', 'Toggle small-caps'));
    tb.append(chks);
    return tb;
  };

  function spin(event) {
    var UP = event.keyCode === $.ui.keyCode.UP,
        DOWN = event.keyCode === $.ui.keyCode.DOWN;
    if(!UP && !DOWN) return;
    var units = $(this).val().replace('.', '').replace(/\d+/, '') || 'px',
        amt = (units === 'px' ? 1 : 0.05),
        val = Number($(this).val().slice(0, -2)),
        newVal = Number(UP ? val+=amt : val-=amt);
    if(isNaN(newVal) || newVal <= 0) {
      newVal = 0; // TODO: Set to a field default.
    }
    if(units === 'em') {
      newVal = newVal.toFixed(2);
    }
    $(this).val(newVal + units);
    updatePreview();
    event.preventDefault();
  };
  
  function loadSetting(setting) {
    $.each(setting, function(i, o) { $('[name="' + i + '"]').val(o); });
    updatePreview();
    currentSetting = setting;
  };

  if(!window._ttLoaded) {
    toolbar = createToolbar();
    controls = toolbar.find('input[type="text"]');
    controls.filter('[name="font-size"],[name="line-height"]').keydown(spin);
    txt.before(toolbar);
    if(!currentSetting) loadSetting(defaultSetting);
    txt.val(LOREM);
    window._ttLoaded = true;
  }

  $('.variation-switch').change(updatePreview);
  $('.font-size-slider').bind('slide', updateFontSize);

// })();