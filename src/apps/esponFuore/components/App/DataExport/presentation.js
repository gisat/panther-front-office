import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import Button, {Buttons} from "../../../../../components/common/atoms/Button";
import Icon from "../../../../../components/common/atoms/Icon";
import './style.scss';
import Loader from "../../../../../components/common/atoms/Loader/Loader";

class DataExport extends React.PureComponent {

	static propTypes = {
		activeSelection: PropTypes.object,
		onExport: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			applyFilterChecked: false,
			downloading: null
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
			this.setState({downloading: type});
			this.props.onExport(type, this.state.applyFilterChecked).then(() => {
				this.setState({downloading: null, errorMessage: null});
			}).catch(err => {
				this.setState({downloading: null, errorMessage: err.message});
				console.error(err.message);
			});
		}
	}

	render() {
		let ruleClasses = classNames("esponFuore-export-rule", {
			disabled: !this.props.activeSelection
		});

		let loader = this.renderLoader();

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
						<Button disabled={this.state.downloading === "geojson"} onClick={this.onExportClick.bind(this, "geojson")}>
							<Icon icon="json"/>
							GeoJSON
							{this.state.downloading === "geojson" ? loader : null}
						</Button>
						<Button disabled={this.state.downloading === "shp"} onClick={this.onExportClick.bind(this, "shp")}>
							<Icon icon="shapefile"/>
							Shapefile
							{this.state.downloading === "shp" ? loader : null}
						</Button>
						<Button disabled={this.state.downloading === "csv"} onClick={this.onExportClick.bind(this, "csv")}>
							<Icon icon="csv"/>
							CSV
							{this.state.downloading === "csv" ? loader : null}
						</Button>
						<Button disabled={this.state.downloading === "xls"} onClick={this.onExportClick.bind(this, "xls")}>
							<Icon icon="xls"/>
							XLS
							{this.state.downloading === "xls" ? loader : null}
						</Button>
					</Buttons>
				</div>
				{this.state.errorMessage ? <div className="esponFuore-export-error-message">{this.state.errorMessage}</div> : null}
			</div>
		);
	}

	renderLoader() {
		return (
			<Loader
				background="transparent"
			/>
		);
	}
}

export default DataExport;
