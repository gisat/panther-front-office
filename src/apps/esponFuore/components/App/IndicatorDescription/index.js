import {connect} from '@gisatcz/ptr-state';

import Select from '../../../state/Select';

import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeIndicator: Select.specific.esponFuoreIndicators.getActive(state)
	}
};

export default connect(mapStateToProps)(presentation);