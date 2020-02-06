import React from 'react';
import PropTypes from 'prop-types';
import MapTools from './MapTools';
import Timeline from './Timeline';
// import './style.scss';

class SzifCaseFooter extends React.PureComponent {
	static propTypes = {
		addMap: PropTypes.func,
		activeMapKey: PropTypes.string,
		// borderOverlays: PropTypes.object,
		// case: PropTypes.object,
		mapsContainer: PropTypes.object,
		mapsCount: PropTypes.number,
		mapSetKey: PropTypes.string,
		selectedMapOrder: PropTypes.number,
		// userGroups: PropTypes.array,
		// toggleGeometries: PropTypes.func,
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {selectedMapOrder, activeMapKey, addMap, mapsCount} = this.props;
		return (
			<div style={{width: '100%',display: 'flex'}}>
				<MapTools
					// showAfter={borderOverlays && borderOverlays.after}
					// showBefore={borderOverlays && borderOverlays.before}
					// case={case}
					// userGroups={userGroups}
					mapKey={activeMapKey}
					addMap={addMap}
					// mapsContainer={mapsContainer}
					mapsCount={mapsCount}
					// mapSetKey={mapSetKey}
					selectedMapOrder={selectedMapOrder}
					// toggleGeometries={toggleGeometries}
				/>
				<Timeline mapKey={activeMapKey}/>
			</div>
		);
	}
}

export default SzifCaseFooter;
