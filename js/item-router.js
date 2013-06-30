/*global APP:true, _:true, jQuery:true, Backbone:true, JST:true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2*/

//Hash Urls should behave statelessly so back/refresh works like magic
(function () {
  "use strict";
  window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
  APP.Routers.NoteRouter = Backbone.Router.extend({
    routes: {
		"note/new": "create",
		"note/:id/edit": "edit",
		"*path": "create" //default
    },

    initialize: function (options) {
		this.notes =  new APP.Collections.NoteCollection();
		this.notes.fetch({success: (function(){
			Backbone.history.start();
			this.list = new APP.Views.NoteListView({notes: this.notes});
			this.list.render();
		}).bind(this)});
    },
	
    create: function () {
		// two views are managed here
		this.currentView = new APP.Views.NoteNewView({notes: this.notes, note: new APP.Models.NoteModel()});
		$('#primary-content').html(this.currentView.render().el);
    },

    edit: function (id) {
		var note = this.notes.get(id);
		this.currentView = new APP.Views.NoteEditView({note: note});
		$('#primary-content').html(this.currentView.render().el);
    }
	
  });
}());