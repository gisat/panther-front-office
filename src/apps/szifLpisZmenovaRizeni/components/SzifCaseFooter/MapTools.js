import React from 'react';
import PropTypes from 'prop-types';
import Button from "../../../../components/common/atoms/Button";
import Icon from "../../../../components/common/atoms/Icon";
import MapsGridIcon from "../../../../components/presentation/atoms/MapsGridIcon";
import LpisCaseStatuses from "../../constants/LpisCaseStatuses";
import AddMapButton from "./AddMapButton";

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
		const {showAfter, showBefore, toggleGeometries, mapKey} = this.props;
		const newShowBefore = (key === 'before') ? e.target.checked : showBefore;
		const newShowAfter = (key === 'after') ? e.target.checked : showAfter;
		toggleGeometries(mapKey, newShowBefore, newShowAfter);
	}

	render() {
		const {showAfter, showBefore, mapsCount, addMap, mapKey, selectedMapOrder} = this.props;
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
						<div className="ptr-dromasLpisChangeReviewHeader-map-name">{mapKey ? ("Mapa " + (selectedMapOrder + 1)) : ""}</div>
					</div>
					<AddMapButton disabled={mapsCount >= 9} addMap={addMap}/>
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
}

export default MapTools;
