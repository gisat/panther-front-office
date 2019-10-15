import React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import {getCartogramColorScale} from '../../../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'

import diagrams from "./sampleDiagrams";
import polygons from "./samplePolygons";
import preview_1 from '../../../../../assets/previews/preview_1.png';
import preview_2 from '../../../../../assets/previews/preview_2.png';
import preview_3 from '../../../../../assets/previews/preview_3.png';
import preview_4 from '../../../../../assets/previews/preview_4.png';

const previews = [preview_1, preview_2, preview_3, preview_4];
const CHOROPLETH_INTERVALS = 5;

function getSampleBasedOnUuid (collection, count, uuid) {
	if (count >= collection.length) {
		return collection;
	} else {
		let uuidPart = uuid.substring(0,8);
		let startingIndex = parseInt(uuidPart, 16) % (collection.length - count);
		let endingIndex = startingIndex + count - 1;
		return collection.slice(startingIndex, endingIndex);
	}
}

function getSomeDiagramsOrdered (key) {
	return _.orderBy(getSampleBasedOnUuid(diagrams, 20, key), ['r'], ['desc']);
}

function getColorFromScale (color, index) {
	let scale = getCartogramColorScale(color, CHOROPLETH_INTERVALS);
	let colorRgb = scale[index % CHOROPLETH_INTERVALS];
	return `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`;
}

class IndicatorCard extends React.PureComponent {
	static propTypes = {
		indicator: PropTypes.object,
		attribute: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.state = {
			diagrams: getSomeDiagramsOrdered(props.indicator.key),
			polygons: getSampleBasedOnUuid(polygons, 40, props.indicator.key),
			backgroundImage: previews[props.index % previews.length]
		}
	}

	componentDidUpdate() {

	}

	render() {
		const props = this.props;
		const name = props.indicator && props.indicator.data.nameDisplay;
		const type = props.attribute && props.attribute.data.valueType;
		const color = props.attribute && props.attribute.data.color;

		const style = {backgroundImage: 'url(' + this.state.backgroundImage + ')'};

		let features = null;
		if (type === 'absolute') {
			features = this.renderDiagrams(color);
		} else if (type === 'relative') {
			features = this.renderChoropleth(color);
		}

		return (
			<div className="esponFuore-indicator-card" style={style}>
				<span>{name}</span>
				<svg>
					<g>
						{features}
					</g>
				</svg>
			</div>
		)
	}

	renderDiagrams(color) {
		let style = {};
		if (color) {
			style.fill = color;
		}

		return this.state.diagrams.map((d, index) => <circle key={index} style={style} cx={d.x} cy={d.y} r={d.r}/>)
	}

	renderChoropleth(color) {
		return this.state.polygons.map((p, index) => {
			let style = {};

			if (color) {
				style.fill = getColorFromScale(color, index);
			}

			return <path key={index} style={style} d={p.d}/>
		});
	}
}

export default IndicatorCard;