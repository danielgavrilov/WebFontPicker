var FontMenu = Backbone.View.extend({

    initialize: function(options) {

        this.parent = options.parent;

        this.setElement(this.parent.$('.font-menu')[0]);

        this.isOpen    = false;
        this.fontLimit = 15;
        this.list      = [];
        this.rendered  = [];
        this.query     = '';

        this.$listWrapper    = this.$('.font-list-wrapper');
        this.$list           = this.$('.font-list');
        this.$search         = this.$('.search');
        this.$loadMore       = this.$('.load-more');
        this.$currentWrapper = this.$('.current-wrapper');

        _.bindAll(this, '_onload', 'close', 'maxHeight');

        Fonts.onload(this._onload);
    },

    _onload: function() {
        this.listenTo(this.model, 'change:family', this.updateCurrent);
        this.updateList();
        this.attachEvents();
    },

    attachEvents: function() {

        var menu = this;

        this.$el.on('click', function(event) {
            if (!menu.isOpen) {
                menu.open();
                menu.$search.focus();
                event.stopPropagation();
            } 
            else if (tagName(event.target) === 'input') {
                event.stopPropagation();
            } else {
                var family = getFamily(event.target, menu.el);
                if (family !== undefined) { 
                    menu.model.set({ family: family });
                }
                if (tagName(event.target) === 'b') {
                    menu.model.set({ weight: event.target.dataset.weight })
                }
            }
        });

        this.$search.on('input', function(event) {
            menu.search(event.target.value);
        });

        this.$loadMore.on('click', function(event) {
            menu.updateList(true);
            event.stopPropagation();
        });

        this.$list.on({
            mouseover: function(event) {
                if (menu.isOpen && tagName(event.target) === 'b') {
                    menu.model.setTemp({ weight: event.target.dataset.weight });
                }
                var family = getFamily(event.target, menu.el);
                menu.model.setTemp({ family: family });
            },
            mouseout: function(event) {
                if (tagName(event.target) === 'b') {
                    menu.model.unsetTemp('weight');
                }
            },
            mouseleave: function(event) {
                menu.model.unsetTemp('family');
            }
        });
    },

    open: function() {

        this.isOpen = true;
        Picker.$list.addClass('font-menu-open');
        this.$el.addClass('open-this');
        this.maxHeight();
        this.updateList();

        $(document.body).on('click', this.close);
        $(window).on('resize', this.maxHeight);
    },

    close: function() {

        if (!this.isOpen) return;

        this.isOpen = false;
        Picker.$list.removeClass('font-menu-open');
        this.$el.removeClass('open-this');

        $(document.body).off('click', this.close);
        $(window).off('resize', this.maxHeight);
    },

    highlightCurrent: function() {
        var family = this.model.get('family');
        var nth = this.rendered.indexOf(family);
        var current = (nth > -1) ? this.$list[0].children[nth] : undefined;
        var prev = this.$highlighted && this.$highlighted[0];

        if (prev === current) return;
        
        prev && $(prev).removeClass('current');
        this.$highlighted = current && $(current).addClass('current');
    },

    updateCurrent: function() {
        var family = this.model.get('family');
        var element = this.build([family]);
        this.$currentWrapper.empty().append(element);
    },

    build: function(families) {
        Fonts.load(families);
        var fragment = document.createDocumentFragment();
        _.forEach(families, function(family) {
            fragment.appendChild(elementFromHTML(WFP.Templates.Font(Fonts.list[family])));
        });
        return fragment;
    },

    updateList: function(loadMore) {

        var toRender = [];

        if (!this.query && this.list.length === 0) {
            this.list = _.clone(Fonts.families);
        }

        if (!startsWith(this.list, this.rendered)) {
            this.$list.empty();
            this.rendered = [];
        }

        if (this.rendered.length < this.fontLimit) {
            toRender = _.difference(this.list.slice(0, this.fontLimit), this.rendered);
        }

        if (loadMore) {
            toRender = _.difference(this.list, this.rendered).slice(0, this.fontLimit);
        }

        if (toRender.length) {
            var fragment = this.build(toRender);
            this.$list.append(fragment);
            this.rendered = this.rendered.concat(toRender);
        }

        if (this.rendered.length >= this.list.length) {
            this.$el.addClass('all-loaded');
        } else {
            this.$el.removeClass('all-loaded');
        }

        this.highlightCurrent();
    },

    search: function(query) {

        var menu = this;

        this.query = query;
        this.$listWrapper[0].scrollTop = 0;

        if (!query) {
            this.$el.removeClass('no-results');
            this.list = [];
            this.updateList();
            return;
        }

        Fonts.search(query).done(function(results) {
            if (results.length === 0) {
                menu.$el.addClass('no-results');
            } else { 
                menu.$el.removeClass('no-results');
                menu.list = results;
                menu.updateList();
            }
        });

    },

    maxHeight: function() {
        var w = window;
        var p = Picker.el;
        var calc = (w.innerHeight - 2 * p.offsetTop) - (p.offsetHeight - this.$listWrapper.outerHeight()) + 'px';
        this.$listWrapper.css('max-height', calc);
    }

});
