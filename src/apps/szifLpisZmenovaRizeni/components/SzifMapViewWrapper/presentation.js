import React from 'react';
import PropTypes from 'prop-types';

import MapView from '../SzifMapView';

class SzifMapView extends React.PureComponent {
	static propTypes = {
		activeCase: PropTypes.object,
	};

	render() {
		const {activeCase} = this.props;
		return (
			activeCase ? <MapView /> : null
		)
	}
}

export default SzifMapView;
