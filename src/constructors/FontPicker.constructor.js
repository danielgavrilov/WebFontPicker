function FontPicker() {

    var picker = window['GoogleFontPicker'] = this;

    var activeStyle,
        hideAfter = 2500, //ms
        hideTimeout;

    this.init = function() {
        this.styles = [];
        this.template = Templates.Picker;

        this.element = this.render();
        this.$ = this.element.querySelector.bind(this.element);
        this.$$ = this.element.querySelectorAll.bind(this.element)
        this.list = this.$('#font-picker-list');
        this.addButton = this.$('.add-style');

        this.attachEvents();

        setTimeout(function(){
            if (picker.styles.length === 0) {
                Picker.add();
            }
        }, 10);
    };

    this.render = function() {
        var element = elementFromHTML(this.template());
        body.appendChild(element);
        return element;
    };

    this.attachEvents = function() {
        events(this.addButton).on('click', this.add.bind(this));
        events(this.element).on('mouseover', this.hideHandler)
                                   .on('mouseout', this.hideHandler);
    };

    this.add = function(state) {
        var style = new StyleView(state);
        this.styles.push(style);
        this.list.appendChild(style.element);
        this.select(style);
        style.selector.focus();
    };

    this.select = function(style) {
        if (activeStyle === style) return;
        if (activeStyle !== undefined) {
            activeStyle.element.classList.remove('selected');
        }
        style.element.classList.add('selected');
        activeStyle = style;
    };

    this.remove = function(style) {
        this.list.removeChild(style.element);
        delete this.styles[this.styles.indexOf(style)];

        if (this.styles.length === 0) {
            Picker.add();
        }
    };

    this.preventFocus = function(event, style) {
        if (style !== activeStyle) {
            activeStyle.selector.blur();
            event.preventDefault();
        }
    };

    this.hideHandler = function(event) {

        if (event.type === 'mouseover' && !picker.element.contains(event.relatedTarget)) {
            events(picker.element).off('blur', picker.hide, true);
            picker.show();
        }

        else if (event.type === 'mouseout' && !picker.element.contains(event.relatedTarget)) {
            if (document.activeElement && picker.element.contains(document.activeElement)) {
                events(picker.element).on('blur', picker.hide, true);
            } else {
                picker.hide();
            }
        }
    };

    this.hide = function() {
        if (!hideTimeout) {
            hideTimeout = setTimeout(function() {
                translateX(picker.element, picker.element.offsetWidth - 15);
            }, hideAfter);
        }
    };

    this.show = function() {
        clearTimeout(hideTimeout);
        hideTimeout = null;
        translateX(picker.element, 0);
    };

    this.init();
}
