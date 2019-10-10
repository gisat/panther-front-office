import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import Button, {Buttons} from "../../../../../components/common/atoms/Button";
import './style.scss';

class DataExport extends React.PureComponent {

	static propTypes = {
		activeSelection: PropTypes.object,
		onExport: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			applyFilterChecked: false
		};

		this.onApplyFilterClick = this.onApplyFilterClick.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (!this.props.activeSelection) {
			this.setState({
				applyFilterChecked: false
			});
		}
	}

	onApplyFilterClick() {
		this.setState({
			applyFilterChecked: !this.state.applyFilterChecked
		});
	}

	onExportClick(type) {
		if (this.props.onExport) {
			this.props.onExport(type, this.state.applyFilterChecked);
		}
	}

	render() {
		let ruleClasses = classNames("esponFuore-export-rule", {
			disabled: !this.props.activeSelection
		});

		return (
			<div className="esponFuore-export">
				<div className="esponFuore-export-settings">
					<div className={ruleClasses}>
						<label title={!this.props.activeSelection ? "No areas filtered" : null}>
							<input disabled={!this.props.activeSelection} type="checkbox" checked={this.state.applyFilterChecked} onChange={this.onApplyFilterClick}/>
							<span>Apply current filter</span>
						</label>
					</div>
				</div>
				<div className="esponFuore-export-buttons">
					<Buttons vertical>
						<Button icon="json" onClick={this.onExportClick.bind(this, "geojson")}>GeoJSON</Button>
						<Button disabled icon="shapefile" onClick={this.onExportClick.bind(this, "shp")}>Shapefile</Button>
						<Button disabled icon="csv" onClick={this.onExportClick.bind(this, "csv")}>CSV</Button>
						<Button disabled icon="xls" onClick={this.onExportClick.bind(this, "xls")}>XLS</Button>
					</Buttons>
				</div>
			</div>
		);
	}
}

export default DataExport;
