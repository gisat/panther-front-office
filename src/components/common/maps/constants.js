export const defaultMapView = {
	center: {
		lat: 45,
		lon: 10
	},
	boxRange: 10000000,
	tilt: 0,
	roll: 0,
	heading: 0
};

export const numberOfLevels = 18;
export const zoomCoefficient = 500;

export const vectorLayerDefaultFeatureStyle = {
	fillColor: null,
	fillOpacity: 0,
	strokeColor: "#444",
	strokeWidth: 2,
};

export const vectorLayerHighlightedFeatureStyle = {
	fillOpacity: 0.2,
	fillColor: "#ff0000",
	strokeColor: "#ff0000",
	strokeWidth: 3,
};