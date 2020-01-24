import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.maps.getActiveSetKey(state);
	const activeMapKey = Select.maps.getMapSetActiveMapKey(state, mapSetKey);
	const maps = Select.maps.getMapSetMapKeys(state, mapSetKey) || [];
	return {
		activeMapKey,
		borderOverlays: Select.components.get(state, 'szifZmenovaRizeni_BorderOverlays', activeMapKey),
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
		toggleGeometries: (mapKey, geometryBefore, geometryAfter) => {
			const mapsBorderOverlays = {
				before: !!geometryBefore,
				after: !!geometryAfter,
			}

			dispatch(Action.components.update('szifZmenovaRizeni_BorderOverlays', {[mapKey]: mapsBorderOverlays}));
			// sync map with component szifZmenovaRizeni_BorderOverlays
			dispatch(Action.specific.szifLpisZmenovaRizeni.updateMap(mapKey));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
