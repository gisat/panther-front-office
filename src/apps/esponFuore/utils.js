import utils from '../../utils/utils';

function resolveColour(attribute) {
	let colour = attribute && attribute.data.colour;

	if (attribute && attribute.key && (!colour || colour === '#ffffff' || colour === '#000000')) {
		colour = getColourFromKey(attribute.key);
	}

	return colour;
}

function resolveColours(attribute) {
	let colours = attribute && attribute.data.colours && attribute.data.colours.length > 0 ? attribute.data.colours : null;

	if (attribute && attribute.key && !colours) {
		//use predefined colors based on attributeKey
		colours = getColoursFromKey(attribute.key);
	}

	return colours;
}

function getColourFromKey(key) {
	return utils.stringToColours(key, 1)[0];
}

function getColoursFromKey(key) {
	return utils.stringToColoursScale(key);
}

export default {
	resolveColour,
	resolveColours,
	getColourFromKey
}