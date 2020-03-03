import React from 'react';
import PropTypes from 'prop-types';
import context from '../../App/context/context';

import App from './index';

class TreesInTime extends React.PureComponent {
	static contextType = context;

	componentDidMount() {
		this.context.updateContext({
			activeView: 'UN_SEEA_TREES_IN_TIME',
			windowSetKey: "un_seea_trees_in_time",
			mapSetKey: "un_seea_trees_in_time_2017",
			applicationKey: 'un_seea',
			activeChartSet: "unSeeaTreesInTimeCharts",
			vectorLayerStyleKey: 'treesInTime',
			activeAttributeKey: 'CrownID',
			// activeSpatialDataSourceKey: "un_seea_boundaries",
		})
	}
	render() {
		const {activeView, activeSpatialDataSourceKey} = this.context;
		return (
			activeView && activeView === 'UN_SEEA_TREES_IN_TIME' ? (<App 
							activeView={activeView} 
							activeSpatialDataSourceKey={activeSpatialDataSourceKey}
							homePath={this.props.homePath}
							/>
							) : null
		);
	}
}

export default TreesInTime;