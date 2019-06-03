import WorldWind from 'webworldwind-esa';

 // Set up the common placemark attributes.
 var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
 placemarkAttributes.imageScale = 0.05;
 placemarkAttributes.imageColor = WorldWind.Color.WHITE;
 placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
	 WorldWind.OFFSET_FRACTION, 0.5,
	 WorldWind.OFFSET_FRACTION, 1.5);
//  placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

export const defaultVectorStyle = (geometry, properties) => {
	geometry.bbbox = properties.bbox;
	var configuration = {};

	if (properties && (properties.name || properties.Name || properties.NAME)) {
		configuration.name = properties.name || properties.Name || properties.NAME;
	}

	if (geometry.isPointType() || geometry.isMultiPointType()) {
		configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
	}
	else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
		configuration.attributes = new WorldWind.ShapeAttributes(null);
		configuration.attributes.drawOutline = true;
		configuration.attributes.outlineColor = new WorldWind.Color(
			0.1 * configuration.attributes.interiorColor.red,
			0.3 * configuration.attributes.interiorColor.green,
			0.7 * configuration.attributes.interiorColor.blue,
			1.0);
		configuration.attributes.outlineWidth = 2.0;
	}
	else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
		configuration.attributes = new WorldWind.ShapeAttributes(null);

		// Fill the polygon with a random pastel color.
		configuration.attributes.interiorColor = new WorldWind.Color(
			0.375 + 0.5 * Math.random(),
			0.375 + 0.5 * Math.random(),
			0.375 + 0.5 * Math.random(),
			0.5);
		// Paint the outline in a darker variant of the interior color.
		configuration.attributes.outlineColor = new WorldWind.Color(
			0.5 * configuration.attributes.interiorColor.red,
			0.5 * configuration.attributes.interiorColor.green,
			0.5 * configuration.attributes.interiorColor.blue,
			1.0);
	}

	configuration.userProperties = properties;

	return configuration;
};