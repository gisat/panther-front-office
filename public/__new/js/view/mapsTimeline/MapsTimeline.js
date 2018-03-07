define([
	'../../actions/Actions',
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'../../../../../src/components/controls/MapsTimeline/index.js',

	'string',
	'jquery',
	'tinysort',
	'react',
	'react-dom'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			component,

			S,
			$,
			tinysort,
			React,
			ReactDOM
){

	var MapsTimeline = function(options){


		this.build();
	};


	MapsTimeline.prototype.build = function() {
		ReactDOM.render(component, document.getElementById('maps-container-bar-bottom'))
	};



	return MapsTimeline;
});