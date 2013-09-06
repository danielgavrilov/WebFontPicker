var StyleList = Backbone.Collection.extend({
    
    model: Style,

    initialize: function() {
        _.bind(this, 'addNew');
        this.on('remove', this.addIfEmpty);
        this.addIfEmpty();
    },

    // Adds a new blank model to the collection (and selects it).
    addNew: function() {
        var model = new Style;
        this.add(model).select(model);
    },

    // Adds a new model if the collection is empty.
    addIfEmpty: function() {
        if (this.length === 0) {
            this.addNew();
        }
    },

    // Returns the model that is selected.
    selected: function() {
        return this.findWhere({ selected: true });
    },

    // Selects a model.
    select: function(model) {
        if (model.get('selected')) return;
        var selected = this.selected();
        if (selected) selected.set('selected', false);
        model.set('selected', true);
    }

});
