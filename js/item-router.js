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
	//TODO: all urls should be 
    create: function () {
		// two views are managed here
		var person = new APP.Models.personModel();
		var self = this;
		person.save(null, {success: function(obj) {
			self.persons.add(obj);
			window.location.hash = "person/"+ obj.id +"/edit";
		}});
    },

    edit: function (id) {
		var person = this.persons.get(id);
		if(!person){
			window.location.hash = "create";
			return;
		}
		this.persons.setSelected( person);
		this.currentView = new APP.Views.personEditView({person: person});
		$('#primary-content').html(this.currentView.render().el);
    }
	
  });
}());