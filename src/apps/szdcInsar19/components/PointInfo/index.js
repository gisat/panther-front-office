import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import utils from "../../../../utils/utils";


const mapStateToProps = (state, ownProps) => {
	return {
		activeSelection: Select.selections.getActive(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'szdcInsar19_PointInfo' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			onPointsChange: (keys) => {
				dispatch(Action.specific.szdcInsar19.pointInfoUse(componentId, keys));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);