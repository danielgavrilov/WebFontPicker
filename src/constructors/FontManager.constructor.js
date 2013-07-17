function FontManager() {

    var fonts = this,
        callbacks = [],
        callbackName = 'fontsAPICallback',
        listAPI = 'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=' + GOOGLE_DEVELOPER_API_KEY + '&callback=',
        fontsAPI = '//fonts.googleapis.com/css?family=',
        letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'.split('');

    fonts.loaded = []; // array of loaded family names as strings
    fonts.done = false;

    fonts.init = function() {
        window[callbackName] = fonts.jsonCallback;
        fonts.getFontList();
    };

    fonts.getFontList = function() {
        var script = document.createElement('script');
        script.async = true;
        script.src = listAPI + callbackName;
        document.head.appendChild(script);
    };

    fonts.jsonCallback = function(json) {
        if (json.kind !== 'webfonts#webfontList') throw new Error('Could not load webfonts');
        
        fonts.done = true;
        fonts.families = [];
        fonts.list = {};

        _.forEach(json.items, function(obj, index){
            fonts.families.push(obj.family);
            fonts.list[obj.family] = obj;
        });

        _.forEach(callbacks, function(obj){
            obj.callback.call(obj.context);
            delete obj.callback;
        });
    };

    fonts.load = function(families) {

        families = _.difference(families, fonts.loaded);

        if (!families.length) return;

        var url = fontsAPI;
        var fragments = [];

        _.forEach(families, function(family) {
            fonts.loaded.push(family);
            fragments.push(family.replace(/ /g, '+') + ':' + fonts.list[family].variants.join(','));
        });

        url += fragments.join('|');
        loadStylesheet(url);
    };

    fonts.onload = function(callback, context) {
        if (typeof callback === "function") {
            if (fonts.done) {
                callback.call(context);
            } else {
                callbacks.push({
                    callback: callback,
                    context: context
                });
            }
        }
    };


    fonts.search = function(keyword) {

        if (!keyword || typeof keyword !== 'string') return [];

        keyword = keyword.toLowerCase();

        // if keyword is a single letter, search for fonts starting with letter
        if (keyword.length === 1 && _.contains(letters, keyword)) {
            return _.filter(fonts.families, function(family) {
                return family.slice(0,1).toLowerCase() === keyword;
            });
        }

        return _.pluck(_.filter(fonts.list, function(fontObj){
            return fontObj.family.toLowerCase().indexOf(keyword) > -1 ||
                   fontObj.variants.join(' ').indexOf(keyword) > -1;
        }), 'family');
    }

    fonts.init();
}
