(function() {

    "use strict";

    // Expose the constructor to the global scope.
    window.Adjustable = Adjustable;

    /**
     * Makes an HTML element adjustable.
     *
     * @constructor
     * @param {HTMLElement} element The element that contains the adjustable value.
     * @param {Object} options
     */
    function Adjustable(element, options) {

        // Prevent chaos if the constructor is executed without the `new` keyword.
        if (!(this instanceof Adjustable)) return new Adjustable(element, options);

        var reNumber = /[\+-]?(\d+\.\d+|\.\d+|\d+)/;

        // Default options.
        var defaults = {

            /**
             * Minimum value limit.
             * @type {number}
             */
            min: -Infinity,

            /**
             * Maximum value limit.
             * @type {number}
             */
            max: Infinity,

            /** 
             * How much a value is increased/decreased by each subsequent step.
             * @type {number}
             */
            step: 1,

            /**
             * Step size when the Shift key is held.
             * @type {number}
             */
            shiftStep: undefined,

            /**
             * Step size when the Ctrl/Alt key is held.
             * @type {number}
             */
            altStep: undefined,

            /**
             * The number of pixels (horizontally) between two subsequent steps.
             * @type {number}
             */
            stepWidth: 4,

            /**
             * A function that returns the formatted value, with the necessary 
             * units and prefixes, when given the raw number value.
             *
             * @this {Adjustable}
             * @param {number} value The raw number value
             * @return {string|number} The formatted value
             */
            formatter: function(value) {
                return value;
            },

            /**
             * The inverse of formatter: a function that strips out prefixes 
             * and units, and returns the raw number value.
             *
             * @this {Adjustable}
             * @param {string} input The formatted value
             * @return {number} The raw number value
             */
            parseInput: function(input) {
                return +(input.match(reNumber)[0]);
            }
        };

        var _this = this;

        options = extend({}, defaults, options);
        
        /**
         * Stores the current value.
         * @type {number}
         */
        var currentValue;

        /**
         * Last x-coordinate that caused a change in value.
         * @type {number}
         */
        var lastX;

        /**
         * Stores current step size. 
         * Step sizes can change by holding Shift or Ctrl/Alt.
         * @type {number}
         */
        var step = options.step;

        /**
         * Whether the value is being adjusted.
         * @type {boolean}
         */
        this.adjusting = false;

        /**
         * Formats a value with the specified `formatter` function.
         */
        function formatter(value) {
            return options.formatter.call(_this, value);
        }

        /**
         * Parses a value with the specified `parseInput` function.
         */
        function parseInput(input) {
            return options.parseInput.call(_this, input);
        }

        /**
         * Returns the text content of the element.
         * @return {string} Text content of the element.
         */
        function getContent() {
            return element.textContent;
        }

        /**
         * Updates the element contents to show the current value.
         */
        function updateHTML() {
            element.innerHTML = formatter(currentValue);
        }

        /**
         * Implements min and max limits.
         * @param {number} value
         * @return {number}
         */
        function validate(value) {
            if (isNaN(value)) value = 0;
            if (value < options.min) return options.min;
            else if (value > options.max) return options.max;
            else return value;
        }

        /**
         * Generates a formatter when given the formatted and raw value.
         * @param {string} input The formatted value
         * @param {number} value The raw number value
         * @return {function} The generated formatter function
         */
        function generateFormatter(input, value) {
            
            input = String(input);
            value = String(value);

            var fragments = input.split(value);
            var prefix = fragments[0];
            var suffix = fragments.slice(1).join();

            return function(value) {
                return prefix + value + suffix;
            }
        }

        /**
         * Sets the current step, depending on whether Shift or Ctrl/Alt is pressed.
         * Falls back to normal step if they're undefined.
         * @param {HTMLEvent} event
         */
        function setStep(event) {
        /* Shift  */ if (event.shiftKey) step = options.shiftStep || options.step;
        /* Alt    */ else if (event.altKey || event.ctrlKey) step = options.altStep || options.step;
        /* Normal */ else step = options.step;
        }


        // DOM Events
        // =====================================================================

        function mouseDown(event) {

            _this.adjusting = true;

            lastX = event.clientX;

            window.addEventListener('mouseup', mouseUp, false);
            window.addEventListener('mousemove', mouseMove, false);

            element.classList.add('adjusting');

            // Keep the cursor style, even when it leaves the element bounds.
            document.body.style.cursor = 'ew-resize';

            // Prevents text selection and text cursor while adjusting.
            event.preventDefault();
        }

        function mouseMove(event) {

            setStep(event);

            var dx = event.clientX - lastX;
            var numOfSteps = Math.round(dx / options.stepWidth);
            
            if (numOfSteps) {

                var value = currentValue + (step * numOfSteps);
                value = strip(value);
                _this.set(value);

                lastX += numOfSteps * options.stepWidth;
            }
        }

        function mouseUp(event) {

            _this.adjusting = false;

            window.removeEventListener('mouseup', mouseUp, false);
            window.removeEventListener('mousemove', mouseMove, false);

            element.classList.remove('adjusting');

            document.body.style.cursor = '';
        }


        // Public interface
        // =====================================================================

        this.set = function(value, forceChange) {

            if (typeof value === 'string') {
                value = parseInput(value);
            }

            if (typeof value !== 'number') {
                throw new TypeError('Cannot set a value that is not a number.');
            }

            value = validate(value);

            if (value !== currentValue || forceChange) {
                currentValue = value;
                this.fire('change', value, formatter(value));
                updateHTML();
            }

            return this;
        };

        this.get = function() {
            return currentValue;
        };

        this.getFormatted = function() {
            return formatter(currentValue);
        };

        this.reset = function() {
            this.set(getContent(), true);
            return this;
        };

        this.detach = function() {
            element.removeEventListener('mousedown', mouseDown, false);
            element.style.cursor = '';
            return this;
        };

        this.element = element;


        // Initialize
        // =====================================================================

        if (options.formatter === defaults.formatter) {
            var input = getContent();
            var value = parseInput(input);
            options.formatter = generateFormatter(input, value);
        }

        element.addEventListener('mousedown', mouseDown, false);
        element.style.cursor = 'ew-resize';

        this.reset();
    }


    // Events
    // =========================================================================

    extend(Adjustable.prototype, {

        on: function(name, callback) {
            this.listeners || (this.listeners = {});
            if (!this.listeners[name]) this.listeners[name] = [];
            if (this.listeners[name].indexOf(callback) === -1) {
                this.listeners[name].push(callback);
            }
            return this;
        },

        off: function(name, callback) {
            if (!name) { 
                this.listeners = {}; 
            } else if (!callback) { 
                delete this.listeners[name];
            } else {
                var index = this.listeners.indexOf(callback);
                if (index > -1) {
                    this.listeners.splice(index, 1);
                }
            }
            return this;
        },

        fire: function(name /*, arguments... */) {
            var events = this.listeners && this.listeners[name];
            var args = slice.call(arguments, 1);
            if (events && events.length) {
                for (var i = 0, len = events.length; i < len; i++) {
                    events[i].apply(this, args);
                }
            }
            return this;
        }

    });


    // Helpers
    // =========================================================================
    // Some code borrowed from underscore.js [http://underscorejs.org/].

    function slice() {
        return Array.prototype.slice.apply(this, arguments);
    }

    function extend(obj /*, sources... */) {
        slice.call(arguments, 1).forEach(function(source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        });
        return obj;
    }

    function clone(obj) {
        return extend({}, obj);
    }

    /**
     * A hack to deal with floating-point (im)precision. Rounds values (such as
     * 4.300000000000001) to their more likely desired result (4.3)
     * @param {number} value
     * @return {number}
     */
    function strip(value) {
        return parseFloat(value.toPrecision(12));
    }

})();