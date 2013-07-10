var body = document.body;

var transform = (function() {
    if (body.style.webkitTransform !== undefined) return 'webkitTransform';
    if (body.style.MozTransform !== undefined) return 'MozTransform';
    return 'transform';
})();

var Stylesheet = (function(){

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

var FONTS_LIMIT = 15;

var KEYBOARD = {
    ESC: 0
};

var Fonts = new FontManager;
var Picker = new FontPicker;

Picker.add({ selector: 'header h1' });
Picker.add({ selector: 'section h1' });
Picker.add({ selector: 'h2, h2 *' });
Picker.add({ selector: 'time' });
Picker.add({ selector: 'p, li' });

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