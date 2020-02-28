import {connect} from 'react-redux';
import {Action, Select} from '@gisatcz/ptr-state';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		activeCase: Select.cases.getActive(state),
		activeLayerTemplateKey: Select.layerTemplates.getActiveKey(state),
		activePeriodKey: Select.periods.getActiveKey(state),
	}
};

export default connect(mapStateToProps)(presentation);