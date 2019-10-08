import React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import {getCartogramColorScale} from '../../../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'

import sampleDiagrams from "./sampleDiagrams";
import samplePolygons from "./samplePolygons";
import preview_1 from '../../../../../assets/previews/preview_1.png';
import preview_2 from '../../../../../assets/previews/preview_2.png';
import preview_3 from '../../../../../assets/previews/preview_3.png';
import preview_4 from '../../../../../assets/previews/preview_4.png';

const previews = [preview_1, preview_2, preview_3, preview_4];
const CHOROPLETH_INTERVALS = 5;

function getSomeDiagramsOrdered () {
	return _.orderBy(_.sampleSize(sampleDiagrams, 20), ['r'], ['desc']);
}

function getColorFromScale (color) {
	let colorRgb = _.sample(getCartogramColorScale(color, CHOROPLETH_INTERVALS));
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
			diagrams: getSomeDiagramsOrdered(),
			polygons: _.sampleSize(samplePolygons, 45),
			index: Math.floor(Math.random() * (previews.length))
		}
	}

	componentDidUpdate() {

	}

	render() {
		const props = this.props;
		const name = props.indicator && props.indicator.data.nameDisplay;
		const type = props.indicator && props.indicator.data.type;
		const color = props.attribute && props.attribute.data.color;

		const style = {backgroundImage: 'url(' + previews[this.state.index] + ')'};

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

		return this.state.diagrams.map(d => <circle style={style} cx={d.x} cy={d.y} r={d.r}/>)
	}

	renderChoropleth(color) {
		return this.state.polygons.map(p => {
			let style = {};

			if (color) {
				style.fill = getColorFromScale(color);
			}

			return <path style={style} d={p.d}/>
		});
	}
}

export default IndicatorCard;