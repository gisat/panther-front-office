import {connect} from '@gisatcz/ptr-state';
import {Select, Action} from '@gisatcz/ptr-state';

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		maps: Select.maps.getMapSetMapKeys(state, props.mapSetKey)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
