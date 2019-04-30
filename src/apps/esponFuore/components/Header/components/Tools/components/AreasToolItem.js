import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';

import presentation from "./ToolItem";
import ColumnChart from "../../../../../../../components/common/charts/ColumnChart/ColumnChart";
import ChartWrapper from "../../../../../../../components/common/charts/ChartWrapper/ChartWrapper";
import sample_15 from "../../../../../../../components/common/charts/mockData/sample_50";

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: Select.windows.isOpen(state, ownProps.itemKey)
	}
};

// TODO change components. Charts just for testing
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		closeWindow: () => {
			dispatch(Action.windows.remove(ownProps.windowSetKey, ownProps.itemKey));
		},
		openWindow: () => {
			dispatch(Action.windows.addOrOpen(
				ownProps.windowSetKey,
				ownProps.itemKey,
				{
					title: 'Areas',
					icon: 'map-pin',
					width: 600,
					maxWidth: 1200,
					height: 500
				},
				(
					<ChartWrapper title="Extraordinary looooooooooooooong unusual specific column chart title">
						<ColumnChart
							key="test7"
							data={sample_15}
							maxWidth={1200}
							keySourcePath="key"
							xSourcePath="data.name"
							ySourcePath="data.some_value_1"
							sorting={[["data.some_value_1", "desc"]]}
						/>
					</ChartWrapper>
				))
			);
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);