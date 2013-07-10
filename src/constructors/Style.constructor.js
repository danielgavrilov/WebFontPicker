function Style(state) {

    var defaults = {
        active: true,
        highlight: false,
        selector: '',
        family: '',
        tempFamily: null,
        tempWeight: null,

        // Properties that can be toggled
        weight: '',
        color: '#00f',
        fontSize: '16px',
        lineHeight: '1.5',
        enabled: {
            weight: false,
            color: false,
            fontSize: false,
            lineHeight: false
        }
    };

    this.init = function() {
        this.state = _.isObject(state) ? _.extend(defaults, state) : defaults;
        this.previous = defaults;
        this.css = Templates.CSS;
        this.rule = Stylesheet.newRule();
        this.on('change toggle', this.updateCSS);
        this.updateCSS();
    };

    this.init();
}

_.extend(Style.prototype, Events, {

    set: function(object) {
        
        if (!object) return this;

        var changes = {};

        for (var prop in object) {
            if (!_.has(this.state, prop) || _.isEqual(this.state[prop], object[prop])) continue;
            changes[prop] = this.state[prop] = object[prop];
            this.trigger('change:' + prop, this.state[prop]);
        }

        if (!_.isEmpty(changes)) {
            this.trigger('change', changes);
        }

        return this;
    },

    get: function(prop) {
        if (!prop) return _.clone(this.state);
        return this.state[prop];
    },

    toggle: function(prop) {

        if (!_.has(this.state.enabled, prop)) return this;

        var change = {};
        change[prop] = this.state.enabled[prop] = !this.state.enabled[prop];
        this.trigger('toggle', { enabled: change });

        return this;
    },

    enable: function(prop) {
        if (!this.state.enabled[prop]){
            this.toggle(prop);
        }
    },

    disable: function(prop) {
        if (this.state.enabled[prop]) {
            this.toggle(prop);
        }
    },

    updateCSS: function() {

        if (this.state.active && this.state.selector) {
            var css = this.state.selector + '{' + this.css(this.state) + '}';

            if (this.rule.nodeValue !== css) {
                this.rule.nodeValue = css;
            }
        }

        else if (this.rule.nodeValue !== ' ') {
            this.rule.nodeValue = ' ';
        }

        return this;
    }
    
});
