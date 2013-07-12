var body, 
    transform, 
    Stylesheet,
    Fonts,
    Picker;

var FONTS_LIMIT = 15;

function initialize() {

    try {
        if (GoogleFontPicker && document.body.contains(GoogleFontPicker.element)) { 
            GoogleFontPicker.show();
            return; 
        }
    } catch(e) {}

    body = document.body;

    cssTransform = (function() {
        if (body.style.webkitTransform !== undefined) return 'webkitTransform';
        if (body.style.MozTransform !== undefined) return 'MozTransform';
        return 'transform';
    })();

    Stylesheet = (function(){

        var element = document.createElement('style');
        document.head.appendChild(element);

        function newRule() {
            var rule = document.createTextNode(' ');
            element.appendChild(rule);
            return rule;
        }

        function deleteRule(rule) {
            if (element.contains(rule)) {
                element.removeChild(rule);
            }
        }

        return {
            element: element,
            newRule: newRule,
            deleteRule: deleteRule
        }

    })();

    Fonts = new FontManager;
    Picker = new FontPicker;
}

if (document.readyState == "complete" || document.readyState == "loaded") {
    initialize();
} else {
    window.addEventListener('DOMContentLoaded', initialize, false)
}



// document.body.addEventListener('mouseover', function(event){
//  event.target.style.outline = '1px solid red';
//  event.target.style.cursor = 'default';
    
//  var element = event.target;
//  var selector = '';

//  while (element !== body) {
//      var current = element.nodeName.toLowerCase();
//      if (element.id)
//          current += '#' + element.id;
//      if (element.className)
//          current += '.' + element.className.split(' ').join('.');
//      selector = current + ' > ' + selector;
//      element = element.parentElement;
//  }

//  selector = 'html > body > ' + selector;

//  console.log(selector);
//  event.preventDefault();
// }, false);

// document.body.addEventListener('mouseout', function(event){
//  event.target.style.outline = '';
//  event.target.style.cursor = '';
// }, false);