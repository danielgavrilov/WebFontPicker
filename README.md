# Web Font Picker (WFP)

A bookmarklet that helps designers preview Web Fonts on any website. Currently only supports Google Web Fonts.

## Usage

Bookmark the <a href="javascript:(function(){
    var WFP = window.WFP = window.WFP || {};
    WFP.Picker && WFP.Picker.show();
    if (WFP.attached || WFP.Picker) return;
    function loadCSS(url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        document.head.appendChild(link);
    }
    function loadScript(url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.head.appendChild(script);
    }
    loadCSS('http://gavrilov.co.uk/wfp/WFP.css');
    loadScript('http://gavrilov.co.uk/wfp/WFP.min.js');
    WFP.attached = true;
})();" title="Web Font Picker">Web Font Picker</a> and open it on any website. *The bookmarklet will most likely to change in the future.*

That's about it, for now.