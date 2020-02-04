import React from 'react';
import PropTypes from 'prop-types';
import Button from "../../../../components/common/atoms/Button";
import MapsGridIcon from "../../../../components/presentation/atoms/MapsGridIcon";
import LpisCaseStatuses from "../../constants/LpisCaseStatuses";

class MapTools extends React.PureComponent {

	static propTypes = {
		addMap: PropTypes.func,
		case: PropTypes.object,
		showAfter: PropTypes.bool,
		showBefore: PropTypes.bool,
		map: PropTypes.object,
		mapsContainer: PropTypes.object,
		mapsCount: PropTypes.number,
		mapSetKey: PropTypes.string,
		selectedMapOrder: PropTypes.number,
		toggleGeometries: PropTypes.func
	};

	onToggleGeometry(key, e) {
		const {showAfter, showBefore} = this.props;
		const newShowBefore = (key === 'before') ? e.target.checked : showBefore;
		const newShowAfter = (key === 'after') ? e.target.checked : showAfter;
		this.props.toggleGeometries(this.props.mapKey, newShowBefore, newShowAfter);
	}

	render() {
		const {showAfter, showBefore} = this.props;
		let geometryAfter = this.props.case && this.props.case.data && this.props.case.data.geometryAfter;
		let geometryBefore = this.props.case && this.props.case.data && this.props.case.data.geometryBefore;

		return (
			<div style={{minWidth: '25rem', display: 'flex'}}>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar mapTools">
					<div className="ptr-dromasLpisChangeReviewHeader-map-info">
						{/* <MapsGridIcon
							columns={this.props.mapsContainer.columns}
							rows={this.props.mapsContainer.rows}
							selected={this.props.selectedMapOrder}
						/> */}
						<div className="ptr-dromasLpisChangeReviewHeader-map-name">{this.props.mapKey ? ("Mapa " + (this.props.selectedMapOrder + 1)) : ""}</div>
					</div>
					<div className="ptr-dromasLpisChangeReviewHeader-map-add">
						{this.renderMapAddButton()}
					</div>
				</div>
				<div>
					<div className="ptr-dromasLpisChangeReviewHeader-map-control-toggles">
						<label>
							<input
								disabled={!geometryBefore}
								type="checkbox"
								checked={!!showBefore}
								onChange={this.onToggleGeometry.bind(this, 'before')}
							/>
							<span className="ptr-dromasLpisChangeReview-toggle-legend current" />
							<span className={!geometryBefore ? "disabled" : ""}>Původní hranice DPB</span>
						</label>
						<label>
							<input
								disabled={!geometryAfter}
								type="checkbox"
								checked={!!showAfter}
								onChange={this.onToggleGeometry.bind(this, 'after')}
							/>
							<span className="ptr-dromasLpisChangeReview-toggle-legend proposed" />
							<span className={!geometryAfter ? "disabled" : ""}>Návrh zákresu nové hranice DPB</span>
						</label>
					</div>
				</div>
			</div>
		);
	}

	renderMapAddButton() {
		// if (
		// 	(this.props.case && this.props.case.data.status && this.props.case.data.status.toUpperCase() === LpisCaseStatuses.CREATED.database)
		// 	&& (this.props.userGroups.includes('gisatUsers') || this.props.userGroups.includes('gisatAdmins'))
		// ) {
			return (
				<Button
					disabled={this.props.mapsCount > 11}
					ghost
					icon="plus"
					onClick={() => {this.props.addMap()}}
					small
				/>
			);
		}
	// }

}

export default MapTools;
