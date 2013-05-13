/*global APP:true, _:true, jQuery:true, Backbone:true, JST:true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2*/

//Hash Urls should behave statelessly so back/refresh works like magic
(function () {
  "use strict";
  window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
  APP.Routers.NoteRouter = Backbone.Router.extend({
    routes: {
		"note/new": "create",
		"note/:id/edit": "edit"
    },

    initialize: function (options) {
		this.notes = options.notes;
		this.create();
    },
	
    create: function () {
		// two views are managed here
		this.currentView = new APP.Views.NoteNewView({notes: this.notes, note: new APP.Models.NoteModel()});
		this.list = new APP.Views.NoteListView({notes: this.notes});
		$('#primary-content').html(this.currentView.render().el);
    },

    edit: function (id) {
		var note = this.notes.get(id);
		this.currentView = new APP.Views.NoteEditView({note: note});
		$('#primary-content').html(this.currentView.render().el);
    }
	
  });
}());