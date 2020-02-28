import {connect} from '@gisatcz/ptr-state';
import { withRouter } from '@gisatcz/ptr-state';
import {Action, Select} from '@gisatcz/ptr-state';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		activePlace: Select.places.getActive(state)
	}
};

export default withRouter(connect(mapStateToProps)(presentation));