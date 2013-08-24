function Stylesheet() {

    var element = this.element = document.createElement('style');
    document.head.appendChild(element);

    this.newRule = function(css) {

        var currentCSS = (css = css || ' ');
        var node = document.createTextNode(css);

        element.appendChild(node);

        function set(css) {
            if (css !== currentCSS) {
                node.nodeValue = currentCSS = css;
            }
        }

        function get() {
            return currentCSS;
        }

        return {
            set: set,
            get: get,
            node: node
        };
    };

    this.removeRule = function(rule) {
        if (element.contains(rule.node)) {
            element.removeChild(rule.node);
        }
    };
}
