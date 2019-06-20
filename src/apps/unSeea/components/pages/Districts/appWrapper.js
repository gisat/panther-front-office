import React from 'react';
import PropTypes from 'prop-types';
import AppContext from '../../App/context/context';

import App from './index';

class Apps extends React.PureComponent {
	static contextType = AppContext;

	componentDidMount() {
		this.context.updateAppContext({
			activeView: 'UN_SEEA_DISTRICTS',
			windowSetKey: "un_seea_districts",
			mapSetKey: "un_seea_mapset_districts",
			applicationKey: 'un_seea',
			activeSpatialDataSourceKey: "un_seea_boundaries",
			activeChartSet: "unSeeaDistrictsCharts",
			vectorLayerStyleKey: 'districts',
			activeAttributeKey: 'gid'
		})
	}
	render() {
		const {activeView, activeSpatialDataSourceKey} = this.context;
		return (
			activeView ? (<App 
							activeView={activeView} 
							activeSpatialDataSourceKey={activeSpatialDataSourceKey}
							/>
							) : null
		);
	}
}

export default Apps;