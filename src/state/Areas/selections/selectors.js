import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';
import common from "../../_common/selectors";

const getSubstate = state => state.areas.selections;

const getAll = common.getAll(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);

const getSelectionByColour = createCachedSelector(
	getAll,
	(state, colour) => colour,
	(allSelections, colour) => {
		let selection = _.find(allSelections, (selection) => {
			return selection.data.colour === colour;
		});
		return selection ? selection : null;
	}
)(
	(state, colour) => colour
);

const getSelectionByColourAttributeFilter = createSelector(
	getSelectionByColour,
	(selection) => {
		return selection && selection.data && selection.data.selection ? selection.data.selection.attributeFilter : null;
	}
);

export default {
	getActiveKeys,
	getSelectionByColour,
	getSelectionByColourAttributeFilter
};