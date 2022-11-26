var Fonts = (function() {

    var deferred = $.Deferred(), // Resolved once the list of fonts is received from the Google Fonts API.

        protocol = window.location.protocol === 'https:' ? 'https:' : 'http:',

        apiKey   = 'AIzaSyAiarVBOlH5jvLpBNHUN-WSIbkkxrWB7zM',
        listAPI  = 'https://www.googleapis.com/webfonts/v1/webfonts',
        fontsAPI = protocol + '//fonts.googleapis.com/css?family=',
        letter   = /[a-zA-Z]/,

        list     = {}, // Object of <family name>:<fontObj> available.
        families = [], // Family names available.
        loaded   = [], // Family names loaded.
        onload   = deferred.done;

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
            families.push(obj.family);
            list[obj.family] = obj;
        });

        deferred.resolve(list);
    }

    function generateFragment(fontObj) {
        return fontObj.family.replace(/\s+/g, '+') + 
               ':' + fontObj.variants.join(',');
    }

    function generateURL(families) {

        var fragments = _.map(families, function(family) {
            return generateFragment(list[family]);
        });

        var url = fontsAPI + fragments.join('|');

        return url;
    }

    function load(families) {

        if (typeof families === 'string') families = [families];

        families = _.difference(families, loaded);

        if (!families.length) return;

        loaded = loaded.concat(families);
        loadStylesheet(generateURL(families));
    }

    function search(query) {

        if (!query || typeof query !== 'string') return [];

        query = query.toLowerCase();

        // if query is a single letter, search for fonts starting with letter
        if (query.length === 1 && letter.test(query)) {
            return _.filter(families, function(family) {
                return family.slice(0,1).toLowerCase() === query;
            });
        }

        return _.pluck(_.filter(list, function(fontObj){
            return fontObj.family.toLowerCase().indexOf(query) > -1 ||
                   fontObj.variants.join(' ').indexOf(query) > -1 ||
                   fontObj.subsets.join(' ').indexOf(query) > -1;
        }), 'family');
    }

    return {

        list: list,
        families: families,
        loaded: loaded,
        onload: onload,
        generateURL: generateURL,

        load: function(families) {
            onload(function() {
                load(families);
            });
        },

        search: function(query) {
            var deferred = $.Deferred();
            onload(function() {
                var results = search(query);
                deferred.resolve(results);
            });
            return deferred;
        }
    };

})();
