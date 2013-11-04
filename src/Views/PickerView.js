var PickerView = Backbone.View.extend({

    template: WFP.Templates.Picker,

    initialize: function() {

        var picker = this;

        // Options
        this.hideable = true;   // Whether the picker is hideable.
        this.hideAfter = 1500;  // How long to wait (in milliseconds) before the picker is hidden.
        this.stickOut = 18;     // How much (in px) of the element is visible when hidden to the side.
        this.mouseOver = false; // Whether the cursor is over the picker.

        // Constructing an element from the template
        var element = elementFromHTML(this.template());
        this.setElement(element);

        // Caching selectors
        this.$list = this.$('#font-picker-list');
        this.$add = this.$('.add-style');

        // Attaching events
        this.listenTo(Styles, 'add', this.add);
        this.listenTo(Styles, 'remove', this._onModelRemove); 
        this.attachDOMEvents();

        this.populate();

        // Slides the picker out (it is hidden by default in CSS).
        // Deferred so that the element is first appended to the body.
        _.defer(function() {
            picker.show();
        });
    },

    attachDOMEvents: function() {

        var picker = this;

        this.$el.on({
            mouseenter: function() {
                picker.mouseOver = true;
                picker.show();
            },
            mouseleave: function() {
                picker.mouseOver = false;
                if (!document.activeElement || !$.contains(picker.el, document.activeElement)) {
                    picker.hide();
                }
            },
            focusin: function() {
                picker.show();
            },
            focusout: function() {
                if (!picker.mouseOver) picker.hide();
            }
        });

        this.$add.on('click', Styles.addNew);
    },

    // Populates the list of styles.
    populate: function() {
        var picker = this;
        Styles.forEach(function(model) {
            picker.add(model);
        });
    },

    // Creates a new view with the model passed and appends it to the list.
    add: function(model) {
        var view = new StyleView({ model: model });
        this.$list.append(view.el);
        
        _.defer(function() {
            view.$selector.focus();
        });
    },

    // Slides the picker out horizontally. 
    // `px` is the distance (in pixels) from the left edge of the element to the right edge of the window.
    slideOut: function(px) {
        var x = (!isNaN(px)) ? this.el.offsetWidth - px : 0;
        this.$el.css('transform', 'translate3d(' + x + 'px, 0, 0)');
    },

    // Hides the picker after the specified waiting time in the `hideAfter` property.
    hide: function() {
        var picker = this;
        if (this.hideable && !this.hideTimeout) {
            this.hideTimeout = setTimeout(function() {
                picker.slideOut(picker.stickOut);
            }, this.hideAfter);
        }
    },

    // Shows the picker instantly.
    show: function() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
        this.slideOut();
    },

    // Returns all the rules as a string. Used for exporting the CSS.
    // Non-active rules will be included but /* commented out */.
    getCSS: function() {
        var rules = Styles.map(function(model) {
            return model.generateCSS(true);
        });
        rules = _.compact(rules); // remove falsy values
        return rules.join('\n\n');
    }

});
