/*global APP:true, _:true, jQuery:true, Backbone:true, JST:true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2*/

(function () {
  "use strict";
  window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
  APP.Views.personListView = Backbone.View.extend({
    // the constructor
    initialize: function (options) {
      // model is passed through
      this.persons = options.persons;
      this.persons.bind('reset', this.addAll, this);
	  this.persons.bind('add', this.addOne, this);
    },

    // populate the html to the dom
    render: function () {
      this.addAll();
      return this;
    },

    addAll: function () {
      // clear out the container each time you render index
	  $('#listboxul').html(" ");
      _.each(this.persons.models, $.proxy(this, 'addOne'));
    },

    addOne: function (person) {	
      var view = new APP.Views.personRowView({persons: this.persons, person: person});
      $('#listboxul').prepend(view.render().el);
    }
  });
}());
