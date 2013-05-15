/*global APP:true, _:true, jQuery:true, Backbone:true, JST:true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2*/

(function () {
  "use strict";
  window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
  APP.Views.personRowView = Backbone.View.extend({
    // the wrapper defaults to div, so only need to set this if you want something else
    // like in this case we are in a table so a tr
    tagName: "tr",
    // functions to fire on events
    events: {
      "click a.delete": "destroy",
	  "click li": "edit"
    },

    // the constructor
    initialize: function (options) {
      // model is passed through
      this.person  = options.person;
      this.persons = options.persons;
	  this.person.bind('change', this.render, this);
	  this.person.bind('request', this.ajaxStart, this);
	  this.person.bind('sync', this.ajaxComplete, this);
    },
	ajaxStart: function(arg1,arg2,arg3){
		//start spinner
		$('#row-loading-'+this.person.id).fadeIn({duration:100});
	},
	ajaxComplete: function(){
		$('#row-loading-'+this.person.id).fadeOut({duration:100});
	},
    // populate the html to the dom
    render: function () {
      this.$el.html(Mustache.to_html($('#row-tpl').html(), this.person.toJSON()));
      return this;
    },

    // delete the model
    destroy: function (event) {
      event.preventDefault();
      event.stopPropagation();
      // we would call 
      // this.model.destroy();
      // which would make a DELETE call to the server with the id of the item
      this.persons.remove(this.person);
      this.$el.remove();
    },
	
	edit: function(){
		window.location.hash = "person/"+ this.person.id +"/edit";
	}
  });
}());
