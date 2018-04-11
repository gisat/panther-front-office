import React from 'react';
import PropTypes from 'prop-types';
import MapsTimeline from './../../../presentation/controls/MapsTimeline/MapsTimeline';
import Dimensions from 'react-dimensions';
import utils from '../../../../utils/utils';
import _ from 'lodash';

class ChangeReviewMapControl extends React.PureComponent {

	onToggleGeometry(key, e) {
		let showBefore = (key === 'before') ? e.target.checked : !!(this.props.map && this.props.map.placeGeometryChangeReview && this.props.map.placeGeometryChangeReview.showGeometryBefore);
		let showAfter = (key === 'after') ? e.target.checked : !!(this.props.map && this.props.map.placeGeometryChangeReview && this.props.map.placeGeometryChangeReview.showGeometryAfter);
		this.props.toggleGeometries(this.props.map.key, showBefore, showAfter);
	}

	render() {
		return (
			<div className='ptr-change-review-map-control'>
				<span className="ptr-change-review-map-control-map-name">{this.props.map && this.props.map.name}</span>
				<div className="ptr-change-review-map-control-toggles">
					<label>
						<input
							type="checkbox"
							checked={!!(this.props.map && this.props.map.placeGeometryChangeReview && this.props.map.placeGeometryChangeReview.showGeometryBefore)}
							onChange={this.onToggleGeometry.bind(this, 'before')}
						/>
						<span>Původní geometrie</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={!!(this.props.map && this.props.map.placeGeometryChangeReview && this.props.map.placeGeometryChangeReview.showGeometryAfter)}
							onChange={this.onToggleGeometry.bind(this, 'after')}
						/>
						<span>Geometrie po změně</span>
					</label>
				</div>
			</div>
		);
	}

}

export default ChangeReviewMapControl;
