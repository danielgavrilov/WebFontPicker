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
        weight: '',
        fontSize: '16px',
        fontStyle: '',
        color: '#00f',
        lineHeight: '1.5',
        textAlign: 'left',
        textTransform: '',
        letterSpacing: '0'
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

    initialize: function() {

        this.rule = stylesheet.newRule();

        // Enabled properties.
        this.enabled = {
            family:        true,
            weight:        false,
            fontSize:      false,
            fontStyle:     false,
            color:         false,
            lineHeight:    false,
            textAlign:     false,
            textTransform: false,
            letterSpacing: false
        },

        // Temporary properties are saved here.
        // They override any properties and are applied even if the property is disabled.
        this.temp = {};

        this.on('change toggle temporary', this.updateCSS);

        // Fires `select` and `deselect` events when a style is selected/deselected.
        this.on('change:selected', function(model, value) {
            var evt = value ? 'select' : 'deselect';
            this.trigger(evt);
        });

        this.on('destroy', function() {
            this.rule.destroy(); // Removes the CSS rule.
        });
    },

    getState: function() {
        return _.clone(this.attributes);
    },

    isActive: function() {
        return !!(this.get('active') && this.get('selector'));
    },

    isEnabled: function(prop) {
        return this.enabled[prop];
    },

    // Used for enabling/disabling properties, fires all the necessary events and stuff.
    // Use the `enable`, `disable` and `toggle` methods to enable/disable properties.
    _setToggle: function(prop, value) {
        var changes = {};

        if (this.enabled[prop] !== value) {
            changes[prop] = this.enabled[prop] = value;
            this.trigger('toggle:' + prop, value);
            this.trigger('toggle', changes);
        }
    },

    enable: function(prop) {
        this._setToggle(prop, true);
        return this;
    },

    disable: function(prop) {
        this._setToggle(prop, false);
        return this;
    },

    toggle: function(prop) {
        this.enabled[prop] ? this.disable(prop) : this.enable(prop);
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
    
    // Generates the CSS rule, as a string. The optional `beautify` parameter
    // is only used to export CSS, by the user.
    generateCSS: function(beautify) {

        var style = this;
        var state = this.getState();
        var temporary = this.temp;

        if (!state.selector) return;

        var prefix = '    ';
        var suffix = (beautify) ? ';' : ' !important;';
        var props = [];

        props.push(state.selector + ' {');
        _.forEach(this.css, function(css, prop) {
            if ((style.enabled[prop] && state[prop]) || temporary[prop]) {
                var value = temporary[prop] || state[prop];
                if (prop === 'family') { 
                    value = quotes(value); 
                }
                var property = css.split('%value%').join(value);
                props.push( prefix + property + suffix );
            }
        });
        props.push('}');
        
        var rule = props.join('\n');

        if (!state.active) {
            rule = '/*' + rule + '*/';
        }

        return rule;
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
