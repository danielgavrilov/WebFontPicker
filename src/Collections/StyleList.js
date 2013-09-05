var StyleList = Backbone.Collection.extend({
	
	model: Style,

	initialize: function() {
		_.bind(this, 'addNew');
		this.on('remove', this.addIfEmpty);
		this.addIfEmpty();
	},

	// Adds a new model to the collection (and selects it).
	addNew: function() {
		var model = new Style;
        this.add(model).select(model);
	},

	// Adds a new model if the collection is empty.
	addIfEmpty: function() {
		var styles = this; 
		// Deferred so that event handlers can be attached before event fires.
		_.defer(function() {
			if (styles.length === 0) {
				styles.addNew();
			}	
		});
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
