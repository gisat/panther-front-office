import React from 'react';
import PropTypes from 'prop-types';
import Button from "../../../../components/common/atoms/Button";

class MapTools extends React.PureComponent {

	static propTypes = {
		addMap: PropTypes.func,
		selectedMapOrder: PropTypes.number,
		mapKey: PropTypes.string,
		mapsCount: PropTypes.number,
		// case: PropTypes.object,
		// map: PropTypes.object,
		// mapsContainer: PropTypes.object,
	};

	render() {
		const {mapKey, selectedMapOrder} = this.props;
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
					<div className="ptr-dromasLpisChangeReviewHeader-map-add">
						{this.renderMapAddButton()}
					</div>
				</div>
			</div>
		);
	}

	renderMapAddButton() {
		const {mapsCount, addMap} = this.props;
		// if (
		// 	(this.props.case && this.props.case.data.status && this.props.case.data.status.toUpperCase() === LpisCaseStatuses.CREATED.database)
		// 	&& (this.props.userGroups.includes('gisatUsers') || this.props.userGroups.includes('gisatAdmins'))
		// ) {
			return (
				<Button
					disabled={mapsCount > 11}
					ghost
					icon="plus"
					onClick={() => {addMap()}}
					small
				/>
			);
		}
	// }

}

export default MapTools;
