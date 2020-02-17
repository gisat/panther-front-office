import {utils} from "panther-utils"

function resolveColour(attribute) {
	let colour = attribute && attribute.data.colour;

	if (attribute && attribute.key && (!colour || colour === '#ffffff' || colour === '#000000')) {
		colour = getColourFromKey(attribute.key);
	}

	return colour;
}

function getColourFromKey(key) {
	return utils.stringToColours(key, 1)[0];
}

export default {
	resolveColour,
	getColourFromKey
}