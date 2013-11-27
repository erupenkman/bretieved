/*global APP:true, _:true, jQuery:true, Backbone:true, JST:true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2*/

(function () {
  "use strict";

  window.APP = APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
  APP.Models.personModel = Backbone.Model.extend({
	url:"/items", 
    // the default fields
    defaults: {
      name: "Untitled",
      detail: [
		{	label: 'Phone',
			value: ''
		},
		{	
			label: 'Notes',
			value: ''
		}
	  ],
    },
    // the constructor
    initialize: function (options) {
    },
	
	/*adds the detail and raises the change event*/
	addDetail: function(detail){
		var allDetail = this.get('detail');
		allDetail.push(detail);
		this.set({
			detail: allDetail
		});
		this.trigger("change");
		this.trigger("change:detail");
	}
  });
  
  // define the collection in the same file
  window.APP.Collections = window.APP.Collections || {};
  window.APP.Collections.personCollection = Backbone.Collection.extend({
	// Reference to this collection's model.
	url:"/items",
	model: APP.Models.personModel,

	setSelected: function(selectedPerson){
		if (this.selectedPerson) {
			this.selectedPerson.set({selected:false});
		}
		selectedPerson.set({selected:true});
		this.selectedPerson = selectedPerson;
	}
	
  });
}());
