import React from 'react';
import _ from 'lodash';

const classValues = {
	"OK_1": "Segment stabilní",
	"OK_3": "Segment stabilní",
	"VERT_1": "Segment s vertikálním pohybem",
	"VERT_3": "Segment s vertikálním pohybem",
	"COMP1_HORIZ": "Segment podezřelý na přítomnost horizontální komponenty pohybu",
	"COMP2_HORIZ": "Segment podezřelý na přítomnost horizontální komponenty pohybu",
	"COMP1_ACC": "Směr pohybu segmentu nelze spolehlivě určit vlivem nízké přesnosti (např. kvůli šumu, chybě z rozbalení fáze ad.)",
	"DIR_NA": "Směr pohybu segmentu nelze spolehlivě určit vlivem nedostatku detekovaných bodů",
};

class PointInfo extends React.PureComponent {

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
		const props = this.props;
		let featureKey = props.activeSelection &&  props.activeSelection.data &&  props.activeSelection.data.featureKeysFilter &&  props.activeSelection.data.featureKeysFilter.keys &&  props.activeSelection.data.featureKeysFilter.keys[0];

		if (this.props.data && this.props.activeSelection) {
			if (_.isObject(this.props.data)) {
				return (
					<div className="szdcInsar19-point-info">
						<h3>{featureKey}</h3>
						{this.props.data.selectedPeriod && Object.keys(this.props.data.selectedPeriod).length ? (
							<div>
								<h5>Za vybraný časový úsek</h5>
								{this.props.data.selectedPeriod && this.props.data.selectedPeriod.map((attribute, index) => this.renderAttribute(attribute, index))}
							</div>
						) : null }
						{this.props.data.basePeriod && Object.keys(this.props.data.basePeriod).length ? (
						<div>
							<h5>Za celé měření</h5>
							{this.props.data.basePeriod && this.props.data.basePeriod.map((attribute, index) => this.renderAttribute(attribute, index))}
						</div>
						) : null }
						{this.props.data.track && Object.keys(this.props.data.track).length ? (
						<div>
							<h5>Track</h5>
							{this.props.data.track && this.props.data.track.map((attribute, index) => this.renderAttribute(attribute, index))}
						</div>
						) : null }
						
					</div>
				);
			} else {
				return (
					<div className="szdcInsar19-point-info">
						<h3>{featureKey}</h3>
						{this.props.data.map((attribute, index) => this.renderAttribute(attribute, index))}
					</div>
				);
			}
		}
		
		return null;
	}

	renderAttribute(data, index) {
		let value = data.value;
		if (typeof value === 'number') {
			value = Math.round(value*1000)/1000;

			if (value < 9999) {
				if (value && (value % 1) !== 0) {
					value = value.toFixed(3);
				}
				value.toLocaleString();
			} else {
				value = "-";
			}
		}
		if (data.nameInternal === "class") {

			return (
				<div key={index} className="szdcInsar19-point-attribute multiline" title={data.description}>
					<div>{data.name}</div>
					<span>{classValues[value] || classValues["DIR_NA"]}</span>
				</div>
			);

		} else {

			return (
				<div key={index} className="szdcInsar19-point-attribute" title={data.description}>
					<div>{data.name}</div>
					<span>{value}</span>
					<span>{data.unit && value !== '-' ? data.unit : null}</span>
				</div>
			);

		}
	}
}

export default PointInfo;