import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import HoverContext from "../../../components/common/HoverHandler/context";

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
		let content = null;
		let zoneData = _.find(this.props.data, (zone) => {
			return _.get(zone, 'properties.group_key') === selectedZone;
		});

		if (zoneData) {
			let props = zoneData.properties;
			content = (
				<div className="insarBmwStory-zone-info">
					<table>
						<tbody>
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
								<td>{props.wmean_vel_ ? props.wmean_vel_.toFixed(2) : null}</td>
							</tr>
							<tr>
								<td>Max subsidence (coh > 0.5) (mm/year): </td>
								<td>{props.min_vel_av ? props.min_vel_av.toFixed(2) : null}</td>
							</tr>
							<tr>
								<td>Number of input PS (weights): </td>
								<td>{props.n_points}</td>
							</tr>
							<tr>
								<td>Mean coherence: </td>
								<td>{props.mean_coh ? props.mean_coh.toFixed(2) : null}</td>
							</tr>
						</tbody>
					</table>
				</div>
			);
		}

		return (
			<div className="insarBmwStory-zone-info">{content}</div>
		);
	}
}

export default ZoneInfo;

