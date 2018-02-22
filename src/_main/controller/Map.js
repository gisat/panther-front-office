Ext.define('PumaMain.controller.Map', {
	extend: 'Ext.app.Controller',
	views: [],
	requires: [],
	init: function() {

	},

	// URBIS change
	newGetMap: function(){

	},

	onExportMapUrl: function(btn) {

	},
	
	onMultipleYearsToggle: function(btn,pressed) {

	},
	
	switchMap: function(both,second) {

	},
	onFeatureInfoActivated: function(btn,val) {

	},
		
	onMeasureActivated: function(btn,val) {

	},
	// areas can be specified or taken from selection
	onZoomSelected: function(btn,areas) {

	},

	/**
	 * Update overall extent with extent of current area.
	 * It is dealing with dateline issues currently. TODO deal with areas around poles
	 * @param currentExtent {OpenLayers.Bounds}
	 * @param overallExtent {Object}
	 * @returns {Object} updated extent
	 */
	updateExtent: function(currentExtent, overallExtent){

	},

	/**
	 * Check if area is crossing dateline. If so, switch left and right
	 * @param extent {OpenLayers.Bounds}
	 * @returns {OpenLayers.Bounds}
	 */
	checkIfAreaIsCrossingDateLine: function(extent){

	},

	zoomToExtent: function(extent){

	},

	createBaseNodes: function() {

	},

	onMapMove: function(map) {

	},

	onMouseMove: function(e) {

	},
	onMouseOut: function(e) {

	},
	
	afterExtentOutlineRender: function(cmp) {

	},

	getOptions: function(cmp) {

	},

	getOlMap: function(){

	},
	getOlMap2: function(){

	},

	afterRender: function(cmp) {

	},

	onMeasurePartial: function(evt) {

	},

	onFeatureInfo: function(response) {

	},

	updateFeatureInfoControl: function() {

	},

	updateGetFeatureControl: function() {
		

	},
		
	onFeatureSelected: function(evt) {

	},

	onResize: function(cmp) {

	},

	handleMeasureModify: function(point,feature,control) {

	}

});