import React from 'react';
import PropTypes from 'prop-types';
import MapTools from './MapTools';
import Timeline from './Timeline';
// import './style.scss';

class SzifCaseFooter extends React.PureComponent {
	static propTypes = {
		activeMap: PropTypes.object,
		addMap: PropTypes.func,
		case: PropTypes.object,
		mapsContainer: PropTypes.object,
		mapsCount: PropTypes.number,
		selectedMapOrder: PropTypes.number,
		userGroup: PropTypes.string,
		toggleGeometries: PropTypes.func,
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{width: '100%',display: 'flex'}}>
				<MapTools
					case={this.props.case}
					userGroup={this.props.userGroup}
					map={this.props.activeMap}
					addMap={this.props.addMap}
					mapsContainer={this.props.mapsContainer}
					mapsCount={this.props.mapsCount}
					selectedMapOrder={this.props.selectedMapOrder}
					toggleGeometries={this.props.toggleGeometries}
				/>
				<Timeline />
			</div>
		);
	}
}

export default SzifCaseFooter;
