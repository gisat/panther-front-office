import React from 'react';
import PropTypes from 'prop-types';
import Button from "../../../presentation/atoms/Button";
import MapsGridIcon from "../../../presentation/atoms/MapsGridIcon";

class MapTools extends React.PureComponent {

	static propTypes = {
		addMap: PropTypes.func,
		case: PropTypes.object,
		map: PropTypes.object,
		mapsContainer: PropTypes.object,
		mapsCount: PropTypes.number,
		selectedMapOrder: PropTypes.number,
		toggleGeometries: PropTypes.func
	};

	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar mapTools">
					<div className="ptr-dromasLpisChangeReviewHeader-map-info">
						<MapsGridIcon
							columns={this.props.mapsContainer.columns}
							rows={this.props.mapsContainer.rows}
							selected={this.props.selectedMapOrder}
						/>
						<div className="ptr-dromasLpisChangeReviewHeader-map-name">{this.props.map ? ("Mapa " + (this.props.selectedMapOrder + 1)) : ""}</div>
					</div>
					<div className="ptr-dromasLpisChangeReviewHeader-map-add">
						{this.renderMapAddButton()}
					</div>
				</div>
			</div>
		);
	}

	renderMapAddButton() {
		return (
			<Button
				disabled={this.props.mapsCount > 11}
				ghost
				icon="plus"
				onClick={this.props.addMap}
				small
			/>
		);
	}

}

export default MapTools;
