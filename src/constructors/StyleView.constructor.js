function StyleView(state) {

    var style = this;

    this.init = function() {
        
        this.model = new Style(state);
        
        this.template = Templates.Style;
        this.css = Templates.CSS;
        
        this.element = this.render();
        this.$ = this.element.querySelectorAll.bind(this.element)
        this.$$ = this.element.querySelector.bind(this.element);
        this.selector = this.$$('.selector');
        this.weights = this.$$('.select-weight');
        this.checkboxes = {
            active: this.$$('.toggle-active'),
            weight: this.$$('.toggle-weight'),
            color: this.$$('.toggle-color'),
            fontSize: this.$$('.toggle-font-size'),
            lineHeight: this.$$('.toggle-line-height')
        };

        this.rule = Stylesheet.newRule();
        this.fontMenu = new FontMenu(this);

        this.model.on('toggle', this.setCheckbox.bind(this));
        this.model.on('change:family', this.renderWeights.bind(this));
        this.model.on('change:selector change:active', this.setActive.bind(this));

        this.attachEvents();
        this.setActive();
    };

    this.events = {

        'click': {
            '.selector': function(event) {
                Picker.select(style);
            },

            '.font-menu': function(event) {
                this.fontMenu.click(event);
                event.stopPropagation();
            }
        },

        'mousedown': {
            '.selector': function(event) {
                Picker.preventFocus(event, style);
            }
        },

        'mouseover': {
            '.selector': function(event) {
                this.model.set({ highlight: true });
            },

            '.select-weight': function(event) {
                if (event.target.dataset.weight) {
                    this.model.set({ tempWeight: event.target.dataset.weight.toString() });
                }
            },

            '.font-menu': function(event) {

                if (this.fontMenu.open && tagName(event.target) === 'b') {
                    this.model.set({ tempWeight: event.target.textContent.toString() + '00' });
                }

                var family = getFamily(event.target, this.fontMenu.element);

                if (family !== this.model.state.tempFamily) {
                    this.model.set({ tempFamily: family });
                }
            }
        },

        'mouseout': {
            '.selector': function(event) {
                this.model.set({ highlight: false });
            },

            '.select-weight': function(event) {
                if (event.target.dataset.weight) {
                    this.model.set({ tempWeight: null });
                }
            },

            '.font-menu': function(event) {
                if (tagName(event.target) === 'b') {
                    this.model.set({ tempWeight: null });
                }
                if (!this.fontMenu.element.contains(event.relatedTarget)) {
                    this.model.set({ tempFamily: null });
                }
            }
        },

        'change': {
            '.toggle-active': function(event) {
                this.model.set({ active: !this.model.state.active });
            },

            '.toggle-weight': function(event) {
                this.model.toggle('weight');
            },

            '.toggle-color': function(event) {
                this.model.toggle('color');
            },

            '.toggle-font-size': function(event) {
                this.model.toggle('fontSize');
            },

            '.toggle-line-height': function(event) {
                this.model.toggle('lineHeight');
            },

            '.select-weight': function(event) {
                this.model.set({ weight: event.target.dataset.weight.toString() });
                this.model.enable('weight');
            }
        },

        'input': {
            '.selector': function(event) {
                this.model.set({ selector: event.target.value.toString().trim() });
            },

            '.search': function(event) {
                this.fontMenu.search(event.target.value);
            },

            '.change-color': function(event) {
                this.model.set({ color: event.target.value.toString() });
                this.model.enable('color');
            },

            '.change-font-size': function(event) {
                this.model.set({ fontSize: event.target.value.toString() + 'px' });
                this.model.enable('fontSize');
            },

            '.change-line-height': function(event) {
                this.model.set({ lineHeight: event.target.value.toString() });
                this.model.enable('lineHeight');
            },
        }
    };

    this.init();
}

_.extend(StyleView.prototype, {

    render: function() {
        var html = this.template(this.model.state);
        return elementFromHTML(html);
    },

    attachEvents: function() {
        if (!this.events) return;

        for (var event in this.events) {
            for (var selector in this.events[event]) {
                var elements = this.element.querySelectorAll(selector);
                for (var i = 0; i < elements.length; i++) {
                    elements[i].addEventListener(event, this.events[event][selector].bind(this), false);
                }
            }
        }
    },

    setActive: function(param) {
        if (param && this.model.state.active && this.model.state.selector) {
            this.element.classList.remove('inactive');
        } else {
            this.element.classList.add('inactive');
        }
    },

    setCheckbox: function(change) {
        changed = _.keys(change.enabled)[0];
        this.checkboxes[changed].checked = change.enabled[changed];
    },

    renderWeights: function() {
        var variants = Fonts.list[this.model.state.family].variants;
        var weights = getWeights(variants);
        this.weights.innerHTML = Templates.Weights({ weights: weights });
    }
});
