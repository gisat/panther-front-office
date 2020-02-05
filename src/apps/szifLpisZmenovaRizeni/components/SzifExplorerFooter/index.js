import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";

import presentation from './presentation';
const componentID = 'szifZmenovaRizeni_SentinelExplorer';
const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.components.get(state, componentID, 'maps.activeSetKey');
	const mapSet = Select.components.get(state, componentID, `maps.sets.${mapSetKey}`);
	const activeMapKey = mapSet.activeMapKey;
	const mapsKeys = mapSet.maps;

	return {
		mapSetKey,
		activeMapKey,
		// borderOverlays: Select.components.get(state, 'szifZmenovaRizeni_BorderOverlays', activeMapKey),
		mapsContainer: {columns: 3, rows: 2},
		// mapsContainer: Select.components.getMapsContainer(state),
		mapsCount: mapsKeys.length,
		// case: Select.specific.lpisChangeCases.getActive(state),
		selectedMapOrder: mapsKeys.indexOf(activeMapKey),
		// userGroups,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		addMap: ()=>{
			dispatch(Action.specific.szifLpisZmenovaRizeni.addMap());
		},
		toggleGeometries: (mapKey, geometryBefore, geometryAfter) => {
			const mapsBorderOverlays = {
				before: !!geometryBefore,
				after: !!geometryAfter,
			}

			dispatch(Action.components.update('szifZmenovaRizeni_BorderOverlays', {[mapKey]: mapsBorderOverlays}));
			// sync map with component szifZmenovaRizeni_BorderOverlays
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
