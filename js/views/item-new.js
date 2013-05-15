/*global RPM:true, _:true, jQuery:true, Backbone:true, JST:true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2*/

(function () {
  "use strict";
  window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
  APP.Views.personNewView = Backbone.View.extend({
    // functions to fire on events
    events: {
      "click #save-button": "save"
    },

    // the constructor
    initialize: function (options) {
      this.person  = options.person;
      this.persons = options.persons;
    },

    save: function (event) {
		event.stopPropagation();
		event.preventDefault();

		var allValues = [];
		$('#details input').each(function() { allValues.push($(this).val()) })
		// update our model with values from the form
		this.person.set({
			name: $('#name').val(),
			detail: allValues
		});
		this.persons.add(this.person);
		// we would save to the server here with 
		this.person.save(null, {success: function(obj) {
			window.location.hash = "person/"+ obj.id +"/edit";
		}});
		// which would return it with an id, so we fake it and just set it
		// redirect back to the index

		// add it to the collection
    },

    // populate the html to the dom
    render: function () {
      this.$el.html(Mustache.to_html($('#edit-tpl').html(), this.person.toJSON()));
      return this;
    }
  });
}());
