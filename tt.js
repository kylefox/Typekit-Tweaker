// (function() {

  var txt = $('.specimen-editor textarea').css('padding', '10px'),
      toolbar,
      controls;

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
      txt.val("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
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
  
  function createCheckbox(label, property, yesValue, noValue) {
    return $('<input type="checkbox" >').click(function(event) {
      txt.css(property, $(this).attr('checked') ? yesValue : noValue);
    });
  };

  function createToolbar() {
    var tb = $('<div id="tt-tb" />')
              .append(lorem())
              .append(createControl('line-height', 'Line height', txt.css('line-height')))
              .append(createControl('font-size', 'Font size', txt.css('font-size')))
              .append(createControl('color', 'Color', txt.css('color')))
              .append(createControl('background', 'Background', txt.css('background')))
              .append(createCheckbox('Font smoothing', '-webkit-font-smoothing', 'antialiased', 'subpixel-antialiased'))
              .append(createCheckbox('Small caps', 'font-variant', 'small-caps', 'normal'));
    return tb;
  };

  if(!window._ttLoaded) {
    toolbar = createToolbar();
    controls = toolbar.find('input[type="text"]');
    txt.before(toolbar);
    window._ttLoaded = true;
  }

  $('.variation-switch').change(updatePreview);
  $('.font-size-slider').bind('slide', updateFontSize);

// })();