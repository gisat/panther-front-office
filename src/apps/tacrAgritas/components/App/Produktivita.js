import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import {fidColumnName} from "../../constants/MapResources";

class Produktivita extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.state = {
			activeDpbKey: props.data && props.data[0].properties[fidColumnName],
			mapView: props.activePlaceView,
		};

		this.onMapViewChange = this.onMapViewChange.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
		this.onMapPeriodChange = this.onMapPeriodChange.bind(this);
	}

	componentDidMount() {
		if (this.props.placeView) {
			this.setState({mapView: this.props.placeView});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const props = this.props;
		if (props.data) {
			let exists = this.getSelectedAreaData();
			if (!exists) {
				this.setState({
					activeDpbKey: props.data && props.data[0] && props.data[0].properties[fidColumnName]
				});
			}
		}

		if (!this.state.mapView && this.props.placeView) {
			this.setState({mapView: this.props.placeView});
		}
	}

	onMapViewChange(view) {
		this.setState({
			mapView: view
		})
	}

	onMapClick(mapKey, layerKey, fids) {
		this.setState({
			activeDpbKey: fids[0]
		})
	}

	onMapPeriodChange(option) {
		this.setState({
			selectedMapPeriod: option
		});
	}

	render() {
		return (
			<>
				<div className="tacrAgritas-section">
					Produktivita aaaa
				</div>
			</>
		);
	}


	getSelectedAreaData() {
		return _.find(this.props.data, (feature) => feature.properties[fidColumnName] === this.state.activeDpbKey);
	}
}

export default Produktivita;