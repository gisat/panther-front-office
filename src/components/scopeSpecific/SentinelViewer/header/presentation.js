import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

import MapTools from './MapTools';
import User from '../../../common/controls/User';
import UISelect from "../../../presentation/atoms/UISelect/UISelect";

class DromasLpisChangeReviewHeader extends React.PureComponent {

	static propTypes = {
		activeMap: PropTypes.object,
		addMap: PropTypes.func,
		case: PropTypes.object,
		mapsContainer: PropTypes.object,
		mapsCount: PropTypes.number,
		selectedMapOrder: PropTypes.number,
		userGroup: PropTypes.string,
		toggleGeometries: PropTypes.func,
		activePlace: PropTypes.object,
		setActivePlace: PropTypes.func,
	};

	render() {
		const places = this.props.places.map(place => ({label: place.name, value: place.key }))  

		return (
			<div id="sentinelViewerHeader">
				<UISelect
					clearable={false}
					inverted
					options={places}
					value={this.props.activePlace ? this.props.activePlace.key : null}
					placeholder="Místo"
					onChange = {(value) => {this.props.setActivePlace(value.value)}}
				/>
				<div className="containter">
					<div>
						<User />
					</div>
					<div id="sentinelViewerHeader-tools">
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
					</div>
				</div>

			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;
