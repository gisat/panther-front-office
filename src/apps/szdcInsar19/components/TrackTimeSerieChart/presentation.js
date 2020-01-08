import React from 'react';
import _ from 'lodash';
import moment from "moment";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";
import Center from '../../../../components/common/atoms/Center';
import Loader from '../../../../components/common/atoms/Loader/Loader';

import './style.scss';

class TrackTimeSerieChart extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	componentDidUpdate(prevProps) {
		const selection = this.props.activeSelection;
		if (this.props.activeSelection !== prevProps.activeSelection) {
			let keys = selection && selection.data && selection.data.featureKeysFilter && selection.data.featureKeysFilter.keys;
			if (keys && this.props.onPointsChange) {
				this.props.onPointsChange(keys);
			}
		}
	}

	render() {
		let axisValueFormat = "MMM YY";
		let attributeName = null;
		let attributeDescription = null;
		let attributeUnit = null;

		if (this.props.activePeriod) {
			const start = this.props.activePeriod.data && this.props.activePeriod.data.start;
			const end = this.props.activePeriod.data && this.props.activePeriod.data.end;
			if (start && end) {
				const differenceInDays = moment(end).diff(moment(start),'days');
				if (differenceInDays < 100) {
					axisValueFormat = "D MMM YY"
				}
			}
		}

		if (this.props.currentAttribute) {
			const data = this.props.currentAttribute.data;
			if (data.nameDisplay) {
				attributeName = data.nameDisplay;
			}
			if (data.unit) {
				attributeUnit = data.unit;
			}
			if (data.description) {
				attributeDescription = data.description;
			}
		}

		if (this.props.data && this.props.activeSelection) {
			return (
				<HoverHandler>
					<div className="szdcInsar19-chart-container track-time-serie">
						<h4>{attributeName}<span>{attributeUnit ? "(" + attributeUnit + ")" : null}</span></h4>
						{/*{attributeDescription ? <p>{attributeDescription}</p> : null}*/}
						<ScatterChart
							key="time-scale-scatter"

							height={20}
							maxWidth={35}

							data={this.props.data}
							keySourcePath="key"
							nameSourcePath="name"
							xSourcePath="period"
							ySourcePath="value"
							colorSourcePath="color"

							pointRadius={5}
							border

							xScaleType="time"
							xOptions={{
								axisValueFormat,
								popupValueFormat: "D MMMM YYYY",
								timeValueLanguage: 'cs',
								name: 'Datum pořízení'
							}}
							xValuesSize={4}

							yOptions={{
								name: attributeName || "Poloha bodu",
								unit: attributeUnit || "mm",
								min: -65,
								max: 40,
								tickCount: 10
							}}
							yValuesSize={2.5}

							withoutYbaseline={false}
							diverging

							pointSymbol="plus"
						/>
					</div>
				</HoverHandler>
			);
		} else if (this.props.activeSelection) {
			return (
				<div style={{position:'relative', height:'100%'}}><Center horizontally verticaly><Loader /></Center></div>
			);
		} else {
			return null;
		}
	}
}

export default TrackTimeSerieChart;