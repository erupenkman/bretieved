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
      detail: ["Phone", ""],
    },
    // the constructor
    initialize: function (options) {
    }
  });
  
  // define the collection in the same file
  window.APP.Collections = window.APP.Collections || {};
  window.APP.Collections.personCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
	url:"/items",
    model: APP.Models.personModel
  });
}());
