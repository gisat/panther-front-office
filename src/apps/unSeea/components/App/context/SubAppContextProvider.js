import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SubAppContext from './context';

class SubAppContextProvider extends React.PureComponent {

	static propTypes = {
	};

	constructor(props){
		super(props);
		this.state = {
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

		this.updateContext = this.updateContext.bind(this);
	}

	updateContext(options) {

		if (!_.isEmpty(options)) {
			this.setState({...options});
		}
	}
	render() {
		return (
			<SubAppContext.Provider value={{
				updateContext: this.updateContext,
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
			</SubAppContext.Provider>
		);
	}
}

export default SubAppContextProvider;
