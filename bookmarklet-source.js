javascript:(function(){

    var WFP = window.WFP = window.WFP || {},
        protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

    WFP.bookmarklet = 3;

    WFP.Picker && WFP.Picker.show();

    if (WFP.attached || WFP.Picker) return;

    function loadStylesheet(url) {
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

    loadStylesheet(protocol + '//gavrilov.co.uk/wfp/WFP.css');
    loadScript(protocol + '//gavrilov.co.uk/wfp/WFP.full.min.js');

    WFP.attached = true;

})();
