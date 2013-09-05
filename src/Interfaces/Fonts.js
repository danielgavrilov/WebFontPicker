var Fonts = (function() {

    var fonts    = {},
        apiKey   = 'AIzaSyAqsRNfr7thcUSRbazqmLYlm1eBGaFzTwU',
        listAPI  = 'https://www.googleapis.com/webfonts/v1/webfonts',
        fontsAPI = '//fonts.googleapis.com/css?family=',
        letter   = /[a-zA-Z]/;

    var deferred = $.Deferred();

    fonts.list     = {}; // Object of <family name>:<fontObj> available
    fonts.families = []; // Array of family names available
    fonts.loaded   = []; // Array of family names loaded
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

    function generateFragment(family) {
        return family.replace(/ /g, '+') + ':' + fonts.list[family].variants.join(',');
    }

    function load(families) {

        if (typeof families === 'string') families = [families];

        families = _.difference(families, fonts.loaded);

        if (!families.length) return;

        var fragments = [];

        _.forEach(families, function(family) {
            fonts.loaded.push(family);
            fragments.push(generateFragment(family));
        });

        var url = fontsAPI + fragments.join('|');
        loadStylesheet(url);
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

    return fonts;

})();
