import React from 'react';
import PropTypes from 'prop-types';
import AppContext from '../../App/context/context';

import App from './index';

class Apps extends React.PureComponent {
	static contextType = AppContext;

	componentDidMount() {
		this.context.updateAppContext({
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
							/>
							) : null
		);
	}
}

export default Apps;