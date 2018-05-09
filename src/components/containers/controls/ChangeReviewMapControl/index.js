import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ChangeReviewMapControl from './ChangeReviewMapControl';

const mapStateToProps = state => {
	return {
		map: Select.maps.getActiveMap(state),
		scope: Select.scopes.getActiveScopeData(state),
		isDromasAdmin: Select.user.isDromasAdmin(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		toggleGeometries: (mapKey, showBefore, showAfter) => {
			dispatch(Action.maps.update({
				key: mapKey,
				placeGeometryChangeReview: {
					showGeometryBefore: showBefore,
					showGeometryAfter: showAfter
				}
			}));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeReviewMapControl);