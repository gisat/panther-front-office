import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AppContext from './context';

class AppWrapper extends React.PureComponent {

	static propTypes = {
	};

	constructor(props){
		super(props);
		this.state = {
			activeMap: null,
			activeMapSet: null,
			activeAttribute: null,
			activeView: null,
			windowSetKey: null,
			mapSetKey: null,
			applicationKey: null,
			activeSpatialDataSourceKey: null,
			activeChartSet: null,
			vectorLayerStyleKey: null,
			activeAttributeKey: null,
		};

		this.updateAppContext = this.updateAppContext.bind(this);
	}

	updateAppContext(options) {

		if (!_.isEmpty(options)) {
			this.setState({...options});
		}
	}
	render() {
		return (
			<AppContext.Provider value={{
				updateAppContext: this.updateAppContext,
				activeMap: this.state.activeMap,
				activeMapSet: this.state.activeMapSet,
				activeAttribute: this.state.activeAttribute,
				activeView: this.state.activeView,
				windowSetKey: this.state.windowSetKey,
				mapSetKey: this.state.mapSetKey,
				applicationKey: this.state.applicationKey,
				activeSpatialDataSourceKey: this.state.activeSpatialDataSourceKey,
				activeChartSet: this.state.activeChartSet,
				vectorLayerStyleKey: this.state.vectorLayerStyleKey,
				activeAttributeKey: this.state.activeAttributeKey,
			}}>
				{this.props.children}
			</AppContext.Provider>
		);
	}
}

export default AppWrapper;
