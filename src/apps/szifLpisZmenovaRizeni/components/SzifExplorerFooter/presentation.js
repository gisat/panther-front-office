import React from 'react';
import PropTypes from 'prop-types';
import MapTools from './MapTools';
import Timeline from './Timeline';
// import './style.scss';

class SzifCaseFooter extends React.PureComponent {
	static propTypes = {
		addMap: PropTypes.func,
		activeMapKey: PropTypes.string,
		borderOverlays: PropTypes.object,
		case: PropTypes.object,
		mapsContainer: PropTypes.object,
		mapsCount: PropTypes.number,
		mapSetKey: PropTypes.string,
		selectedMapOrder: PropTypes.number,
		userGroups: PropTypes.array,
		toggleGeometries: PropTypes.func,
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{width: '100%',display: 'flex'}}>
				<MapTools
					showAfter={this.props.borderOverlays && this.props.borderOverlays.after}
					showBefore={this.props.borderOverlays && this.props.borderOverlays.before}
					case={this.props.case}
					userGroups={this.props.userGroups}
					mapKey={this.props.activeMapKey}
					addMap={this.props.addMap}
					mapsContainer={this.props.mapsContainer}
					mapsCount={this.props.mapsCount}
					mapSetKey={this.props.mapSetKey}
					selectedMapOrder={this.props.selectedMapOrder}
					toggleGeometries={this.props.toggleGeometries}
				/>
				<Timeline mapKey={this.props.activeMapKey}/>
			</div>
		);
	}
}

export default SzifCaseFooter;
