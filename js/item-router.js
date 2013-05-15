/*global APP:true, _:true, jQuery:true, Backbone:true, JST:true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2*/

//Hash Urls should behave statelessly so back/refresh works like magic
(function () {
  "use strict";
  window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
  APP.Routers.personRouter = Backbone.Router.extend({
    routes: {
		"person/new": "create",
		"person/:id/edit": "edit",
		"*path": "create" //default
    },

    initialize: function (options) {
		this.persons =  new APP.Collections.personCollection();
		
		this.persons.fetch({success: (function(){
			Backbone.history.start();
			this.list = new APP.Views.personListView({persons: this.persons});
			this.list.render();
		}).bind(this)});
    },
	
    create: function () {
		// two views are managed here
		this.currentView = new APP.Views.personNewView({persons: this.persons, person: new APP.Models.personModel()});
		$('#primary-content').html(this.currentView.render().el);
    },

    edit: function (id) {
		var person = this.persons.get(id);
		this.currentView = new APP.Views.personEditView({person: person});
		$('#primary-content').html(this.currentView.render().el);
    }
	
  });
}());