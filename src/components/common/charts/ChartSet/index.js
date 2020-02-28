import React from "react";
import {connect} from '@gisatcz/ptr-state';
import {Select} from '@gisatcz/ptr-state';

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	return {
		set: Select.charts.getSetByKey(state, ownProps.setKey),
		charts: Select.charts.getChartsBySetKeyAsObject(state, ownProps.setKey),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		// Action.charts.add
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
