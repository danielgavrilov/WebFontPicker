// Maximum number of fonts loaded in the Font Menu or number of 
// additional fonts loaded by "Load more". Keep this low as a
// lot of MBs are gonna get wasted.
var FONTS_LIMIT = 15;
var GOOGLE_DEVELOPER_API_KEY = 'AIzaSyAqsRNfr7thcUSRbazqmLYlm1eBGaFzTwU'; // Get your own.

var body, 
    cssTransform, 
    Stylesheet,
    Fonts,
    Picker;

function initialize() {

    body = document.body;

    cssTransform = (function() {
        if (body.style.webkitTransform != undefined) return 'webkitTransform';
        if (body.style.MozTransform != undefined) return 'MozTransform';
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

if (document.readyState == 'complete' || document.readyState == 'loaded') {
    initialize();
} else {
    window.addEventListener('DOMContentLoaded', initialize, false);
}