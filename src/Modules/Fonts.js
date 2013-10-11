var Fonts = (function() {

    var fonts    = {},
        apiKey   = 'AIzaSyAqsRNfr7thcUSRbazqmLYlm1eBGaFzTwU',
        listAPI  = 'https://www.googleapis.com/webfonts/v1/webfonts',
        fontsAPI = '//fonts.googleapis.com/css?family=',
        letter   = /[a-zA-Z]/;

    var deferred = $.Deferred(); // Resolved once the list of fonts is received from the Google Fonts API.

    fonts.list     = {}; // Object of <family name>:<fontObj> available.
    fonts.families = []; // Family names available.
    fonts.loaded   = []; // Family names loaded.
    fonts.onload   = deferred.done;

    $.ajax({
        url: listAPI,
        data: {
            sort: 'popularity',
            key: apiKey
        },
        dataType: 'jsonp',
        success: populate,
        error: function(jqxhr, status, error) {
            console.log('Could not load font list:', jqxhr, status, error);
        }
    });

    function populate(json) {

        _.forEach(json.items, function(obj){
            fonts.families.push(obj.family);
            fonts.list[obj.family] = obj;
        });

        deferred.resolve(fonts.list);
    }

    function generateFragment(fontObj) {
        return fontObj.family.replace(/\s+/g, '+') + 
               ':' + fontObj.variants.join(',');
    }

    function generateURL(families) {

        var fragments = _.map(families, function(family) {
            return generateFragment(fonts.list[family]);
        });

        var url = fontsAPI + fragments.join('|');

        return url;
    }

    function load(families) {

        if (typeof families === 'string') families = [families];

        families = _.difference(families, fonts.loaded);

        if (!families.length) return;

        fonts.loaded = fonts.loaded.concat(families);
        loadStylesheet(generateURL(families));
    }

    function search(query) {

        if (!query || typeof query !== 'string') return [];

        query = query.toLowerCase();

        // if query is a single letter, search for fonts starting with letter
        if (query.length === 1 && letter.test(query)) {
            return _.filter(fonts.families, function(family) {
                return family.slice(0,1).toLowerCase() === query;
            });
        }

        return _.pluck(_.filter(fonts.list, function(fontObj){
            return fontObj.family.toLowerCase().indexOf(query) > -1 ||
                   fontObj.variants.join(' ').indexOf(query) > -1 ||
                   fontObj.subsets.join(' ').indexOf(query) > -1;
        }), 'family');
    }

    fonts.load = function(families) {
        fonts.onload(function() {
            load(families);
        });
    };

    fonts.search = function(query) {

        var deferred = $.Deferred();

        fonts.onload(function() {
            var results = search(query);
            deferred.resolve(results);
        });

        return deferred;
    };

    fonts.generateURL = generateURL;

    return fonts;

})();
