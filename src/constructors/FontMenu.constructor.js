function FontMenu(styleView) {

    var menu = this;

    var defaults = {
        open: false,
        list: [],
        rendered: [],
        keyword: ''
    }

    this.init = function() {
        _.extend(this, defaults);

        this.style = styleView;
        this.model = styleView.model;

        this.element = this.style.element.querySelector('.font-menu');
        this.$ = this.element.querySelectorAll.bind(this.element)
        this.$$ = this.element.querySelector.bind(this.element);
        this.listElement = this.element.querySelector('.font-list');
        this.searchField = this.style.element.querySelector('.search');
        this.noFont = this.element.querySelector('.none');
        this.loadMore = this.element.querySelector('.load-more');

        this.closeMenu = this.closeMenu.bind(this);
        this.maxHeight = this.maxHeight.bind(this);
        this.renderList();
    };

    this.init();
}

_.extend(FontMenu.prototype, {

    getElement: function(family) {
        var index = this.rendered.indexOf(family);
        if (index < 0 && !family) {
            return this.noFont;
        } else {
            return this.listElement.children[index];
        }
    },

    click: function(event) {
        if (!this.open) {
            this.openMenu();
            this.searchField.focus();
        } 
        else if (tagName(event.target) === 'input') {
            return;
        } 
        else if (event.target === this.loadMore){
            this.renderList(true); // load more
        } else {
            var family = getFamily(event.target, this.element);
            if (family !== undefined) this.select(family);
            this.closeMenu();       
        }
    },

    openMenu: function() {

        this.open = true;
        Picker.list.classList.add('font-menu-open');
        this.element.classList.add('open-this');
        this.maxHeight();
        this.renderList();

        // scroll to selected font
        var selected = this.getElement(this.model.state.family);
        this.listElement.scrollTop = selected ? selected.offsetTop : 0;
        
        if (this.keyword) this.search(this.keyword);

        body.addEventListener('click', this.closeMenu, false);
        window.addEventListener('resize', this.maxHeight, false);
    },

    closeMenu: function() {

        if (!this.open) return;

        this.open = false;
        Picker.list.classList.remove('font-menu-open');
        this.element.classList.remove('open-this');
        this.renderList();

        body.removeEventListener('click', this.closeMenu, false);
        window.removeEventListener('resize', this.maxHeight, false);
    },

    renderList: function(loadMore) {
        Fonts.onload(function() {

            var currentFamily = this.model.state.family;
            // remove invalid fonts from list (also removes duplicates)
            var list = _.intersection(this.list, Fonts.families);
            this.list = _.isEmpty(list) ? _.clone(Fonts.families) : list;

            // if list does not begin with items of rendered
            // then destroy rendered
            if (!startsWith(this.list, this.rendered)) {
                this.removeAll();
            }

            if (this.rendered.length >= FONTS_LIMIT && loadMore !== true) {
                var toRender = [];
            } else {
                var toRender = _.difference(this.list, this.rendered).slice(0, FONTS_LIMIT);
            }

            if (!_.contains(this.rendered.concat(toRender), currentFamily) && !this.open && currentFamily) {
                this.list.unshift(currentFamily);
                this.renderList();
                return;
            }

            if (this.list.length === this.rendered.length) {
                this.element.classList.add('all-loaded');
            } else {
                this.element.classList.remove('all-loaded');
                this.append(toRender);
                if (this.list.length <= this.rendered.length) {
                    this.element.classList.add('all-loaded');
                }
            }

            this.select(currentFamily);

        }, this);
    },

    build: function(families) {
        Fonts.load(families);
        var fragment = document.createDocumentFragment();
        _.forEach(families, function(family) {
            fragment.appendChild(elementFromHTML(Templates.Font(Fonts.list[family])));
        });
        return fragment;
    },

    append: function(families) {
        if (!families.length) return;
        var fragment = this.build(families);
        this.listElement.insertBefore(fragment, this.loadMore);
        this.rendered = this.rendered.concat(families);
    },

    removeAll: function() {
        while (this.listElement.firstChild && tagName(this.listElement.firstChild) !== 'button'){
            this.listElement.removeChild(this.listElement.firstChild);
        }
        this.rendered = [];
    },

    select: function(family) {

        var prevFamily = this.model.state.family;
        var family = family || this.model.state.family;
        var prevFamilyElement = this.getElement(prevFamily);
        var familyElement = this.getElement(family);

        prevFamilyElement && prevFamilyElement.classList.remove('current');
        familyElement && familyElement.classList.add('current');

        this.model.set({ family: family });
    },

    search: function(keyword) {

        this.keyword = keyword;
        this.listElement.scrollTop = 0;

        if (!keyword) {
            this.element.classList.remove('no-results');
            this.list = [];
            this.renderList();
            return;
        }

        Fonts.onload(function(){
            var results = Fonts.search(keyword);
            if (results.length < 1) { 
                this.element.classList.add('no-results');
            } else { 
                this.element.classList.remove('no-results');
                this.list = results;
                this.renderList();
            }
        }, this);
    },

    maxHeight: function() {
        var w = window;
        var p = Picker.element;
        var calc = (w.innerHeight - 2 * p.offsetTop) - (p.offsetHeight - this.element.offsetHeight) + 'px';
        
        if (this.listElement.style.maxHeight !== calc) {
            this.listElement.style.maxHeight = calc;
        }
    },

    togglePreview: function() {

    }
});
