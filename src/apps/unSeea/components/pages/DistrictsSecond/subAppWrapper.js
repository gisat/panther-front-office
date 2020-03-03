import React from 'react';
import PropTypes from 'prop-types';
import context from '../../App/context/context';

import App from './index';

class Apps extends React.PureComponent {
	static contextType = context;

	componentDidMount() {
		this.context.updateContext({
			activeView: 'UN_SEEA_DISTRICTS_SECOND',
			windowSetKey: "un_seea_districts_second",
			mapSetKey: "un_seea_mapset_districts_second",
			applicationKey: 'un_seea',
			activeSpatialDataSourceKey: "un_seea_boundaries_second",
			activeChartSet: "unSeeaDistrictsSecondCharts",
			vectorLayerStyleKey: 'districtsChoroplet',
			activeAttributeKey: 'gid'
		})
	}
	render() {
		const {activeView, activeSpatialDataSourceKey} = this.context;
		return (
			activeView && activeView === 'UN_SEEA_DISTRICTS_SECOND' ? (<App 
							activeView={activeView} 
							activeSpatialDataSourceKey={activeSpatialDataSourceKey}
							homePath={this.props.homePath}
							/>
							) : null
		);
	}
}

export default Apps;