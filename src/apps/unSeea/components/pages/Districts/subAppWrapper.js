import React from 'react';
import PropTypes from 'prop-types';
import context from '../../App/context/context';

import App from './index';

class Apps extends React.PureComponent {
	static contextType = context;

	componentDidMount() {
		this.context.updateContext({
			activeView: 'UN_SEEA_DISTRICTS',
			windowSetKey: "un_seea_districts",
			mapSetKey: "un_seea_mapset_districts",
			applicationKey: 'un_seea',
			activeChartSet: "unSeeaDistrictsCharts",
			vectorLayerStyleKey: 'districts',
			activeAttributeKey: 'gid',
			// activeSpatialDataSourceKey: "un_seea_boundaries",
		})
	}
	render() {
		const {activeView, activeSpatialDataSourceKey} = this.context;
		return (
			activeView && activeView === 'UN_SEEA_DISTRICTS' ? (<App 
							activeView={activeView} 
							activeSpatialDataSourceKey={activeSpatialDataSourceKey}
							/>
							) : null
		);
	}
}

export default Apps;