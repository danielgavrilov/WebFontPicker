var StyleList = Backbone.Collection.extend({
    
    model: Style,

    initialize: function() {
        _.bindAll(this, 'addNew');
        this.on('remove', this.addIfEmpty);
        this.addIfEmpty();
    },

    // Adds a new blank model to the collection (and selects it).
    addNew: function() {
        var model = new this.model;
        this.add(model).select(model);
    },

    // Adds a new model if the collection is empty.
    addIfEmpty: function() {
        if (this.length === 0) {
            this.addNew();
        }
    },

    // Selects a model.
    select: function(model) {
        if (model.get('selected')) return;
        var selected = this.findWhere({ selected: true });
        if (selected) selected.set('selected', false);
        model.set('selected', true);
    }

});
