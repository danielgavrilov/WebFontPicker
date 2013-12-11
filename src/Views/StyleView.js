var StyleView = Backbone.View.extend({

    template: WFP.Templates.Style,

    initialize: function() {

        var view = this;

        // Constructing an element from the template
        var element = elementFromHTML(this.template(this.model.getState()));
        this.setElement(element);

        // Caching selectors
        this.$selectorWrapper = this.$('.selector-wrapper');
        this.$selector = this.$('.selector');
        this.$weights = this.$('.select-weight');
        this.$destroy = this.$('.destroy');

        // Font menu has a separate view.
        this.fontMenu = new FontMenu({
            model: this.model,
            parent: this,
            element: this.$('.font-menu')[0]
        });

        // Attaching events
        this.listenTo(this.model, {
            'change:family': this.renderWeights,
            'change:selector change:active': this._setActive,
            'destroy': function() {
                view.$el.animate({
                    height: 0,
                    opacity: 0
                }, {
                    duration: 180,
                    easing: 'easeOutCubic',
                    complete: function() {
                        view.remove();
                    }
                });
            },
            'select': function() {
                var $el = view.$el;
                var initialHeight = $el.outerHeight();
                var finalHeight = $el.addClass('selected').outerHeight();
                
                $el.css('height', initialHeight);
                $el.animate({
                    height: finalHeight
                }, {
                    duration: 180,
                    easing: 'easeOutCubic',
                    complete: function() {
                        $(this).css('height', '');
                    }
                });
            },
            'deselect': function() {
                var $el = view.$el;
                var initialHeight = $el.outerHeight();
                var finalHeight = view.$selectorWrapper.outerHeight();
                
                $el.animate({
                    height: finalHeight,
                    backgroundColor: 'rgba(255,255,255,0)'
                }, {
                    duration: 180,
                    easing: 'easeOutCubic',
                    complete: function() {
                        $(this).removeClass('selected')
                            .css('height', '')
                            .css('backgroundColor', '');
                    }
                });

                view.$selector.blur();
            }
        });

        this.attachDOMEvents();

        // If this is the only style in the list, hide the Delete button.
        if (Styles.length === 1) {
            _.defer(function() {
                view.$destroy.addClass('disabled');
                view.listenToOnce(view.model, 'change', function() {
                    view.$destroy.removeClass('disabled');
                });
            });
        }

        this.checkbox('active', this.$('.toggle-active')[0])
            .checkbox('weight', this.$('.toggle-weight')[0])
            .checkbox('color', this.$('.toggle-color')[0])
            .checkbox('fontSize', this.$('.toggle-font-size')[0])
            .checkbox('lineHeight', this.$('.toggle-line-height')[0]);

        this._setActive();
    },

    attachDOMEvents: function() {

        var view = this;

        this.$selector.on({
            click: function() {
                Styles.select(view.model);
            },
            mousedown: function(event) {
                if (!view.model.get('selected')) {
                    // Prevent focusing on selector input when style is not selected.
                    event.preventDefault();
                }
            },
            mouseover: function() {
                view.model.enable('highlight');
            },
            mouseout: function() {
                view.model.disable('highlight');
            },
            input: function(event) {
                view.model.set({ selector: event.target.value.trim() });
            }
        });

        this.$weights.on({
            change: function(event) {
                view.model.set({ weight: event.target.dataset.weight });
                view.model.enable('weight');
            },
            mouseover: function(event) {
                if (event.target.dataset.weight) {
                    view.model.setTemp({ weight: event.target.dataset.weight });
                }
            },
            mouseout: function(event) {
                if (event.target.dataset.weight) {
                    view.model.unsetTemp('weight');
                }
            }
        });

        this.$destroy.on('click', function() {
            view.model.destroy();
        });

        this.$('.change-color').on('input', function(event) {
            view.model.set({ color: event.target.value.toString() });
            view.model.enable('color');
        });


        Adjustable(this.$('.change-font-size')[0], {
            min: 0,
            step: 1,
            shiftStep: 10,
            altStep: 0.1
        }).on('change', function(value, formatted) {
            view.model.set({ fontSize: formatted });
            view.model.enable('fontSize');
        }).on('start', function() {
            Picker.hideable = false;
        }).on('end', function() {
            Picker.hideable = true;
        });

        Adjustable(this.$('.change-line-height')[0], {
            min: 0,
            step: 0.1,
            shiftStep: 1,
            altStep: 0.01,
            formatter: function(value) { return value.toFixed(2); }
        }).on('change', function(value, formatted) {
            view.model.set({ lineHeight: formatted });
            view.model.enable('lineHeight');
        }).on('start', function() {
            Picker.hideable = false;
        }).on('end', function() {
            Picker.hideable = true;
        });
    },

    // Given a model property and a DOM element, it attaches both a listener on the element 
    // and the property, so that when one changes the other is updated accordingly.
    checkbox: function(prop, element) {

        if (element && element.checked === undefined) throw new Error('Passed element is not a checkbox');

        var model = this.model;
        var enabled = model.enabled[prop];
        var attr = model.get(prop);

        if (typeof enabled === 'boolean') {

            model.on('toggle:' + prop, function(checked) {
                element.checked = checked;
            });

            $(element).on('change', function() {
                model.toggle(prop);
            });

        } else if (typeof attr === 'boolean') {
            
            model.on('change:' + prop, function(model, checked) {
                element.checked = checked;
            });

            $(element).on('change', function() {
                attr = !attr;
                model.set(prop, attr);
            });

        }

        return this;
    },

    // Updates the list of available weights. Hopefully will move it in a separate view one day.
    renderWeights: function() {

        var family = this.model.get('family');
        var variants = Fonts.list[family].variants;
        var weights = getWeights(variants);
        var template = WFP.Templates.Weights;

        this.$weights.html(template({
            weights: weights, 
            selected: this.model.get('weight')
        }));

        return this;
    },

    // Simply adds a class to the parent element if the style is not active.
    // A bit overcomplicated for optimisation purposes.
    _setActive: function() {

        var active = this.model.isActive();

        if (active === !!this._hasInactiveClass) {
            this.el.classList.toggle('inactive');
            this._hasInactiveClass = !this._hasInactiveClass;
        }

    }

});
