import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.maps.getActiveSetKey(state);
	const activeMapKey = Select.maps.getMapSetActiveMapKey(state, mapSetKey);
	const maps = Select.maps.getMapSetMapKeys(state, mapSetKey) || [];

	return {
		activeMap: Select.maps.getMapByKey(state, activeMapKey),
		mapsContainer: {columns: 3, rows: 2},
		// mapsContainer: Select.components.getMapsContainer(state),
		mapsCount: maps.length,
		case: Select.specific.lpisChangeCases.getActive(state),
		selectedMapOrder: maps.indexOf(activeMapKey),
		userGroup: 'gisatAdmins',
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		addMap: ()=>{
			// window.Stores.notify('mapsContainer#addMap');
		},
		toggleGeometries: (mapKey, showBefore, showAfter) => {
			dispatch(Action.maps.update({
				key: mapKey,
				placeGeometryChangeReview: {
					showGeometryBefore: showBefore,
					showGeometryAfter: showAfter
				}
			}));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
