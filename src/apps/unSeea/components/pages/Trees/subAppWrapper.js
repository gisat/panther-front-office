import React from 'react';
import PropTypes from 'prop-types';
import context from '../../App/context/context';

import App from './index';

class Trees extends React.PureComponent {
	static contextType = context;

	componentDidMount() {
		this.context.updateContext({
			activeView: 'UN_SEEA_TREES',
			windowSetKey: "un_seea_trees",
			mapSetKey: "un_seea_trees_mapset",
			applicationKey: 'un_seea',
			activeSpatialDataSourceKey: "un_seea_trees",
			activeChartSet: "unSeeaTreesCharts",
			vectorLayerStyleKey: 'trees',
			activeAttributeKey: 'TREE_ID'
		})
	}
	render() {
		const {activeView, activeSpatialDataSourceKey} = this.context;
		return (
			activeView && activeView === 'UN_SEEA_TREES' ? (<App 
							activeView={activeView} 
							activeSpatialDataSourceKey={activeSpatialDataSourceKey}
							homePath={this.props.homePath}
							/>
							) : null
		);
	}
}

export default Trees;