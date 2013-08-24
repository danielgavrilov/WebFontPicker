var StyleList = Backbone.Collection.extend({
	
	model: Style,

	selected: function() {
		return this.findWhere({ selected: true });
	},

	select: function(model) {
		if (model.get('selected')) return;
		var selected = this.selected();
		if (selected) selected.disable('selected');
		model.enable('selected');
	}

});
