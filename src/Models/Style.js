var Style = Backbone.Model.extend({

    defaults: {

        // Style selected (expanded).
        selected: false,

        // Apply CSS rule.
        active: true,

        // Highlight selected elements.
        highlight: false,

        // Selector used in CSS rule.
        selector: '',

        // Properties below control the CSS output.
        // If a property is enabled, the value is applied to the CSS rule.

        family: '',
        familyEnabled: true,
        
        weight: '',
        weightEnabled: false,

        fontSize: '16px',
        fontSizeEnabled: false,

        fontStyle: '',
        fontStyleEnabled: false,

        color: '#00f',
        colorEnabled: false,

        lineHeight: '1.5',
        lineHeightEnabled: false,

        textAlign: 'left',
        textAlignEnabled: false,

        textTransform: '',
        textTransformEnabled: false,

        letterSpacing: '0',
        letterSpacingEnabled: false

    },

    initialize: function() { 
        this.rule = stylesheet.newRule();
        this.on('change toggle temporary', this.updateCSS);
        this.on('toggle:selected', function(value) {
            var evt = value ? 'select' : 'deselect';
            this.trigger(evt);
        });
        this.on('destroy', function() {
            stylesheet.removeRule(this.rule);
        });
    },

    getState: function() {
        return _.clone(this.attributes);
    },

    css: {
        family:        'font-family: %value%',
        weight:        'font-weight: %value%',
        fontSize:      'font-size: %value%',
        fontStyle:     'font-style: %value%',
        color:         'color: %value%',
        lineHeight:    'line-height: %value%',
        textAlign:     'text-align: %value%',
        textTransform: 'text-transform: %value%',
        letterSpacing: 'letter-spacing: %value%',
        highlight:     'text-shadow: 0 0 5px rgba(255, 255, 255, 0.85), 0 0 10px rgba(0, 125, 255, 0.85), 0 0 20px #0CF, 0 0 30px #FFF'
    },

    temp: {},

    _toggleMap: {
        selected: 'selected',
        active: 'active',
        highlight: 'highlight'
    },

    _toggleProp: function(prop, value) {
        return this._toggleMap[prop] || prop + 'Enabled';
    },

    _setToggleProp: function(prop, value) {
        var property = this._toggleProp(prop);
        var changes = {};

        if (this.get(property) !== value) {
            this.set(property, value);
            changes[prop] = value;
            this.trigger('toggle:' + prop, value);
            this.trigger('toggle', changes);
        }
    },

    isActive: function() {
        return !!(this.get('active') && this.get('selector'));
    },

    propEnabled: function(prop) {
        return !!this.get(this._toggleProp(prop));
    },

    enable: function(prop) {
        this._setToggleProp(prop, true);
        return this;
    },

    disable: function(prop) {
        this._setToggleProp(prop, false);
        return this;
    },

    toggle: function(prop) {
        if (this.propEnabled(prop)) {
            this.disable(prop);
        } else {
            this.enable(prop);
        }

        return this;
    },

    setTemp: function(object) {

        if (!object) return this;

        var changed = false;
        var changes = {};

        for (var prop in object) {
            if (this.temp[prop] !== object[prop]) {
                changes[prop] = this.temp[prop] = object[prop];
                this.trigger('temporary:' + prop, object[prop]);
                changed = true;
            }
        }

        if (changed) {
            this.trigger('temporary', changes);
        }

        return this;
    },

    unsetTemp: function(prop) {

        if (this.temp[prop] !== undefined) {
            delete this.temp[prop];
            this.trigger('temporary:' + prop);
            this.trigger('temporary');
        }

        return this;
    },
    
    generateCSS: function(beautify) {

        var style = this;
        var state = this.getState();
        var temporary = this.temp;

        var prefix = '    ';
        var suffix = (beautify) ? ';' : ' !important;';
        var props = [];

        props.push(state.selector + ' {');

        _.forEach(this.css, function(css, prop) {
            if (style.propEnabled(prop) && state[prop] || temporary[prop]) {
                var value = temporary[prop] || state[prop];
                var property = css.split('%value%').join(value);
                props.push( prefix + property + suffix );
            }
        });

        props.push('}');

        return props.join('\n');
    },

    updateCSS: function() {

        if (this.isActive()) {
            this.rule.set(this.generateCSS());
        } else {
            this.rule.set(' ');
        }

        return this;
    }

});
