var StyleView = Backbone.View.extend({

    template: WFP.Templates.Style,

    initialize: function() {

        var view = this;
        var element = elementFromHTML(this.template(this.model.getState()));

        this.setElement(element);

        this.$selector = this.$('.selector');
        this.$weights  = this.$('.select-weight');
        this.$destroy  = this.$('.destroy');

        this.fontMenu = new FontMenu({
            model: this.model,
            parent: this
        });

        this.listenTo(this.model, {
            'change:family': this.renderWeights,
            'change:selector change:active': this._setActive,
            'destroy': this.remove,
            'select': function() {
                view.$el.addClass('selected');
            },
            'deselect': function() {
                view.$el.removeClass('selected');
                view.$selector.blur();
            }
        });

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
        this.attachEvents();
    },

    attachEvents: function() {

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
                view.model.setTemp({ highlight: true });
            },
            mouseout: function() {
                view.model.unsetTemp('highlight');
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

        this.$('.change-color').on('input', function() {
            view.model.set({ color: event.target.value.toString() });
            view.model.enable('color');
        });
        this.$('.change-font-size').on('input', function() {
            view.model.set({ fontSize: event.target.value.toString() + 'px' });
            view.model.enable('fontSize');
        });
        this.$('.change-line-height').on('input', function() {
            view.model.set({ lineHeight: event.target.value.toString() });
            view.model.enable('lineHeight');
        });
    },

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

    _setActive: function() {
        if (this.model.isActive()) {
            this.$el.removeClass('inactive');
        } else {
            this.$el.addClass('inactive');
        }
    }

});
