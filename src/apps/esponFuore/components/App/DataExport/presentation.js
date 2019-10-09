import React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button, {Buttons} from "../../../../../components/common/atoms/Button";
import './style.scss';

class DataExport extends React.PureComponent {

	static propTypes = {
		onExport: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			applyFilterChecked: false
		};

		this.onApplyFilterClick = this.onApplyFilterClick.bind(this);
	}

	onApplyFilterClick() {
		this.setState({
			applyFilterChecked: !this.state.applyFilterChecked
		});
	}

	onExportClick(type) {
		if (this.props.onExport) {
			this.props.onExport(type);
		}
	}

	render() {
		return (
			<div className="esponFuore-export">
				<div className="esponFuore-export-settings">
					<div className="esponFuore-export-rule">
						<label>
							<input type="checkbox" value={this.state.applyFilterChecked} onChange={this.onApplyFilterClick}/>
							<span>Apply current filter</span>
						</label>
					</div>
				</div>
				<div className="esponFuore-export-buttons">
					<Buttons vertical>
						<Button icon="geojson" onClick={this.onExportClick.bind(this, "geojson")}>GeoJSON</Button>
						<Button icon="shapefile" onClick={this.onExportClick.bind(this, "shp")}>Shapefile</Button>
						<Button icon="csv" onClick={this.onExportClick.bind(this, "csv")}>CSV</Button>
						<Button disabled icon="xls" onClick={this.onExportClick.bind(this, "xls")}>XLS</Button>
					</Buttons>
				</div>
			</div>
		);
	}
}

export default DataExport;
