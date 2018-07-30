import React from 'react';
import PropTypes from 'prop-types';

class DromasLpisChangeReviewHeader extends React.PureComponent {

	onToggleGeometry(key, e) {
		let showBefore = (key === 'before') ? e.target.checked : !!(this.props.map && this.props.map.placeGeometryChangeReview && this.props.map.placeGeometryChangeReview.showGeometryBefore);
		let showAfter = (key === 'after') ? e.target.checked : !!(this.props.map && this.props.map.placeGeometryChangeReview && this.props.map.placeGeometryChangeReview.showGeometryAfter);
		//this.props.toggleGeometries(this.props.map.key, showBefore, showAfter);
	}

	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar">
					map
				</div>
				<div>
					<div className="ptr-dromasLpisChangeReviewHeader-map-control-toggles">
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
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;
