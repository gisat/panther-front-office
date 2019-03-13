import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	
	return {
		case: Select.specific.lpisCheckCases.getActiveCase(state),
		nextCaseKey: Select.specific.lpisCheckCases.getNextCaseKey(state, null, ownProps.scope_key),
		previousCaseKey: Select.specific.lpisCheckCases.getPreviousCaseKey(state, null, ownProps.scope_key),
		map: Select.maps.getActiveMap(state),
		changingCase: Select.specific.lpisCheckCases.getChangingCase(state),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		caseVisited: (caseKey, visited) => {dispatch(Action.specific.lpisCheckCases.setCaseVisited(caseKey, visited))},
		caseConfirmed: (caseKey, confirmed) => {dispatch(Action.specific.lpisCheckCases.setCaseConfirmed(caseKey, confirmed))},
		setActivePlace: (value) => {dispatch(Action.places.setActive(value))},
		addMap: ()=>{
			window.Stores.notify('mapsContainer#addMap');
		},
		showCase: (caseKey) => {
			dispatch(Action.specific.lpisCheckCases.setChanging(true));
			dispatch(Action.specific.lpisCheckCases.setActive(caseKey));
			dispatch(Action.specific.lpisCheckCases.redirectToActiveCaseView()).then(() => {
				//uncomment after rewrite all app to React without need to reload
				// dispatch(Action.specific.lpisCheckCases.setChanging(false));
			});
		},
		onMount: (mapKey, geometry) => {
			dispatch(Action.maps.update({
				key: mapKey,
				placeGeometryChangeReview: {
					showGeometryAfter: geometry,
				}
			}));
		},
		backToList: () => {
			dispatch(Action.components.overlays.views.selectActiveScope());
			dispatch(Action.components.overlays.openOverlay('views'));
			dispatch(Action.components.setIntro(true));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);