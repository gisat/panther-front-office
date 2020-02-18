import React from 'react';
import PropTypes from 'prop-types';
import MapsTimeline from './../../../presentation/controls/MapsTimeline/MapsTimeline';
import {utils} from '@gisatcz/ptr-utils'
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
					<div className="ptr-change-review-map-control-toggles">
						<label>
							<input
								type="checkbox"
								checked={!!(this.props.map && this.props.map.placeGeometryChangeReview && this.props.map.placeGeometryChangeReview.showGeometryBefore)}
								onChange={this.onToggleGeometry.bind(this, 'before')}
							/>
							<span>Původní hranice DPB</span>
						</label>
						<label>
							<input
								type="checkbox"
								checked={!!(this.props.map && this.props.map.placeGeometryChangeReview && this.props.map.placeGeometryChangeReview.showGeometryAfter)}
								onChange={this.onToggleGeometry.bind(this, 'after')}
							/>
							<span>Návrh zákresu nové hranice DPB</span>
						</label>
					</div>
				</div>
			);
	}

}

export default ChangeReviewMapControl;
