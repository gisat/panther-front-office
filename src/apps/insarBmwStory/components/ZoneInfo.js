import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import HoverContext from "../../../components/common/HoverHandler/context";
import bmw_zones from "../data/bmw_zones";

class ZoneInfo extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		data: PropTypes.array
	};

	constructor(props) {
		super(props);
	}

	render() {
		let selectedZone = this.context.selectedItems[0];
		let zoneData = _.find(this.props.data, (zone) => {
			return _.get(zone, 'properties.group_key') === selectedZone;
		});

		if (zoneData) {
			let props = zoneData.properties;
			return (
				<div className="insarBmwStory-zone-info">
					<table>
						<tr>
							<td>Area key: </td>
							<td>{props.group_key}</td>
						</tr>
						<tr>
							<td>Zone: </td>
							<td>{props.cs}</td>
						</tr>
						<tr>
							<td>Distance: </td>
							<td>{props.dist}</td>
						</tr>
						<tr>
							<td>Weighted mean subsidence (mm/year):</td>
							<td>{props.wmean_vel_}</td>
						</tr>
						<tr>
							<td>Max subsidence (coh > 0.5) (mm/year): </td>
							<td>{props.min_vel_av}</td>
						</tr>
						<tr>
							<td>Number of input PS (weights): </td>
							<td>{props.n_points}</td>
						</tr>
						<tr>
							<td>Mean coherence: </td>
							<td>{props.mean_coh}</td>
						</tr>
					</table>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default ZoneInfo;

