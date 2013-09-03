var PickerView = Backbone.View.extend({

    template: WFP.Templates.Picker,
    
    hideAfter: 2000,

    initialize: function() {

        this.setElement(elementFromHTML(this.template()));

        this.$list = this.$('#font-picker-list');
        this.$add  = this.$('.add-style');

        this.listenTo(Styles, 'add', this.append);
        this.listenTo(Styles, 'remove', this._onModelRemove); 
        this.attachEvents();

        this.add();

        Fonts.load('Open Sans');
    },

    attachEvents: function() {

        var picker = this;

        this.$el.on({
            mouseenter: function() {
                picker.mouseOver = true;
                picker.$el.off('blur', picker.hide, true);
                picker.show();
            },
            mouseleave: function() {
                picker.mouseOver = false;
                if (!document.activeElement || !jQuery.contains(picker.el, document.activeElement)) {
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

        this.$add.on('click', this.add);
    },

    _onModelRemove: function(model) {
        if (Styles.length === 0) {
            this.add();
        }
        if (model.get('selected')) {
            Styles.select(Styles.last());
        }
    },

    add: function() {
        var model = new Style;
        Styles.add(model).select(model);
    },

    append: function(model) {
        var view = new StyleView({ model: model });
        this.$list.append(view.el);
        
        _.defer(function() {
            view.$selector.focus();
        });
    },

    slideOut: function(px) {
        var x = (!isNaN(px)) ? this.el.offsetWidth - px : 0;
        this.$el.css('transform', 'translate3d(' + x + 'px, 0, 0)');
    },

    hide: function() {
        var picker = this;
        if (!this.hideTimeout) {
            this.hideTimeout = setTimeout(function() {
                picker.slideOut(20);
            }, this.hideAfter);
        }
    },

    show: function() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
        this.slideOut();
    }

});
