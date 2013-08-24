javascript:(function(){

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

})();
