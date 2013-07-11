function FontPicker() {

    var picker = window['GoogleFontPicker'] = this;

    var activeStyle,
        hideAfter = 2000, //ms
        hideTimeout;

    this.init = function() {
        this.styles = [];
        this.template = Templates.Picker;

        this.element = this.render();
        this.$ = this.element.querySelectorAll.bind(this.element)
        this.$$ = this.element.querySelector.bind(this.element);
        this.list = this.$$('#font-picker-list');
        this.addButton = this.$$('.add-style');

        this.attachEvents();

        setTimeout(function(){
            if (picker.styles.length === 0) {
                Picker.add();
            }
        }, 10);
    };

    this.render = function() {
        var element = elementFromHTML(this.template());
        body.insertBefore(element, body.firstChild);
        return element;
    };

    this.attachEvents = function() {
        attachEventTo(this.addButton).on('click', this.add.bind(this));
        // attachEventTo(this.element).on('mouseover', this.slide);
        // attachEventTo(this.element).on('mouseout', this.slide);
        // attachEventTo(this.element).on('blur', this.slide, true);
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

    // Fix: hides when cursor is still over it, after a blur event
    this.slide = function(event) {
        if (event.type === "mouseover" && hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
            picker.moveRight('');
        } else if (!hideTimeout && !picker.element.contains(event.relatedTarget) && !(document.activeElement && picker.element.contains(document.activeElement))) {
            hideTimeout = setTimeout(function(){
                picker.moveRight(picker.element.offsetWidth - 20);
            }, hideAfter);
        }
    };

    this.moveRight = function(px) {
        if (!px) {
            if (picker.element.style[transform] !== '') {
                picker.element.style[transform] = '';
            }
        } else {
            picker.element.style[transform] = 'translateX(' + px + 'px)'; 
        }
    };

    this.init();
}
