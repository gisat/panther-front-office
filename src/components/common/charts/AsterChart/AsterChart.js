import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import './style.scss';
import utilsFilter from "../../../../utils/filter";
import Segment from "./Segment";

const WIDTH = 250;
const HEIGHT = 250;

const MIN_WIDTH = 150;
const MAX_WIDTH = 800;

const MAX_GRID_STEPS = 10;
const MIN_GRID_GAP = 20;

const STROKE_WIDTH = 2;
const TICK_WIDTH = 8;

// TODO optional
const STARTING_ANGLE = Math.PI/2;
const PADDING = 20;
const PADDING_WITH_CAPTIONS = 40;

class AsterChart extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		forceMinimum: PropTypes.number,
		forceMaximum: PropTypes.number,

		colorSourcePath: PropTypes.string,
		keySourcePath: PropTypes.string,
		nameSourcePath: PropTypes.string,
		valueSourcePath: PropTypes.string,

		width: PropTypes.number,
		minWidth: PropTypes.number,
		maxWidth: PropTypes.number,

		relative: PropTypes.bool,

		grid: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.object
		]),

		radials: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.object
		])
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		/* dimensions */
		let width = props.width ? props.width : WIDTH;
		let height = props.height ? props.height : HEIGHT;

		let minWidth = props.minWidth ? props.minWidth : MIN_WIDTH;
		let maxWidth = props.maxWidth ? props.maxWidth: MAX_WIDTH;

		if (width > maxWidth) width = maxWidth;
		if (width < minWidth) width = minWidth;

		// TODO aspect ratio?
		height = width;

		let padding = props.radials && props.radials.captions ? PADDING_WITH_CAPTIONS : PADDING;

		let innerWidth = width - 2*padding;
		let innerHeight = height - 2*padding;

		/* data preparation */
		let data, minimum, maximum, values, domain, scale, origin = null;
		if (props.data) {
			data = utilsFilter.filterDataWithNullValue(props.data, props.valueSourcePath);
			values = _.map(data, (item) => {return _.get(item, props.valueSourcePath)});

			maximum = props.forceMaximum || props.forceMaximum === 0 ? props.forceMaximum : _.max(values);
			// TODO pass constant for minimum reduction
			minimum = props.forceMinimum || props.forceMinimum === 0 ? props.forceMinimum : _.min(values);

			origin = [width/2, height/2];
			domain = [minimum, maximum];

			scale = d3
				.scaleLinear()
				.domain(domain)
				.range([0, innerHeight/2]);
		}

		return (
			<div className="ptr-chart-container">
				<svg className="ptr-chart ptr-aster-chart" width={width} height={height}>
					{props.radials ? this.renderRadials(data, origin, scale, maximum) : null};
					{data ? this.renderSegments(data, origin, scale) : null}
					{props.grid ? this.renderGrid(domain, origin, scale, width) : null}
				</svg>
			</div>
		);
	}

	renderSegments(data, origin, scale) {
		let segmentAngle = 2*Math.PI/data.length;
		let strokeWidth = data.length < 20 ? STROKE_WIDTH : 1;
		let color = chroma.random();
		let siblings = data.map((item) => _.get(item, this.props.keySourcePath));

		return _.map(data, (segment, index) => {
			let key = _.get(segment, this.props.keySourcePath);

			if (this.props.colorSourcePath) {
				color = _.get(segment, this.props.colorSourcePath)
			}

			let radius = scale(_.get(segment, this.props.valueSourcePath)) + strokeWidth;
			let startAngle = STARTING_ANGLE + index * segmentAngle;
			let endAngle = STARTING_ANGLE + (index+1) * segmentAngle;

			let x0 = origin[0] - Math.cos(startAngle) * radius;
			let y0 = origin[1] - Math.sin(startAngle) * radius;

			let x1 = origin[0] - Math.cos(endAngle) * radius;
			let y1 = origin[1] - Math.sin(endAngle) * radius;

			return (
				<Segment
					key={key}
					itemKey={key}
					origin={origin}
					arcStart={[x0, y0]}
					arcEnd={[x1, y1]}
					radius={radius}

					defaultColor={color}
					highlightedColor={color}
					strokeWidth={strokeWidth}

					nameSourcePath={this.props.nameSourcePath}
					valueSourcePath={this.props.valueSourcePath}
					data={segment}
					siblings={siblings}
				/>
			);
		});
	}

	renderGrid(domain, origin, scale, width) {
		let gridProps = this.props.grid;

		let numOfSteps = gridProps && gridProps.maxSteps ? gridProps.maxSteps : MAX_GRID_STEPS;
		let gap = gridProps && gridProps.minGap ? gridProps.minGap : MIN_GRID_GAP;

		let min = domain[0];
		let max = domain[1];

		if ((width/2) < numOfSteps * gap) {
			numOfSteps = Math.floor((width/2)/gap);
		}

		let step = Math.floor((max-min)/numOfSteps);

		let domainForGrid = [];
		let counter = 0;
		for (let i = max; i > min; i-=step) {
			if (counter < numOfSteps) {
				domainForGrid.unshift(i);
			}
			counter++;
		}

		return (
			<g>
				{
					_.map(domainForGrid, (val, index) => {
						let radius = scale(val);
						let classNames = classnames("ptr-aster-chart-grid-line", {
							strong: (index + 1) === numOfSteps
						});

						let x0 = origin[0];
						let y0 = origin[1] - radius;
						let y1 = origin[1] + radius;

						return <path
							key={radius}
							className={classNames}
							d={`
								M${x0} ${y0}
								A${radius} ${radius} 0 1 1 ${x0} ${y1}
								A${radius} ${radius} 0 1 1 ${x0} ${y0}
							`}
						/>
					})
				}
				{
					gridProps && gridProps.captions ? (
						<g>
							<defs>
								<filter id="glow" x="-50%" y="-10%" width="200%" height="120%">
									<feGaussianBlur stdDeviation="2 2" result="glow"/>
									<feMerge>
										<feMergeNode in="glow"/>
										<feMergeNode in="glow"/>
										<feMergeNode in="glow"/>
										<feMergeNode in="glow"/>
										<feMergeNode in="glow"/>
										<feMergeNode in="glow"/>
									</feMerge>
								</filter>
							</defs>
							{
							_.map(domainForGrid, (val, index) => {
								let text = val.toLocaleString();
								if (this.props.relative) {
									text += " %"
								}

								return (
									<g key={text}>
										<text
											style={{filter: 'url(#glow)'}}
											className="ptr-aster-chart-grid-text-halo"
											textAnchor="middle"
											x={origin[0]}
											y={origin[1] - scale(val) + 5}
										>{text}</text>
										<text
											className="ptr-aster-chart-grid-text"
											textAnchor="middle"
											x={origin[0]}
											y={origin[1] - scale(val) + 5}
										>{text}</text>
									</g>
									);
							})}
						</g>
					) : null
				}
			</g>
		);
	}

	renderRadials(data, origin, scale, maximum) {
		let segmentAngle = 2*Math.PI/data.length;
		let maxRadius = scale(maximum) + TICK_WIDTH;
		let maxTextRadius = scale(maximum) + 2*TICK_WIDTH;

		return _.map(data, (segment, index) => {
			let key = _.get(segment, this.props.keySourcePath) + "-radial";
			let angle = STARTING_ANGLE + (index * segmentAngle) + segmentAngle/2;
			let radius = scale(_.get(segment, this.props.valueSourcePath));

			let x0 = origin[0] - Math.cos(angle) * radius;
			let y0 = origin[1] - Math.sin(angle) * radius;
			let x1 = origin[0] - Math.cos(angle) * maxRadius;
			let y1 = origin[1] - Math.sin(angle) * maxRadius;

			let textAnchor = "start";
			let yTextShift = (1 - Math.sin(angle)) * 4;
			let xTextShift = (-1 - Math.cos(angle)) * 5;

			if (angle > 3/2 * Math.PI) {
				textAnchor = "end";
				xTextShift = (1 - Math.cos(angle)) * 5;
			}

			let textX = origin[0] - Math.cos(angle) * maxTextRadius + xTextShift;
			let textY = origin[1] - Math.sin(angle) * maxTextRadius + yTextShift;

			return (
				<g key={key}>
					<path
						className={"ptr-aster-chart-grid-radial-line"}
						d={`
							M${x0} ${y0}
							L${x1} ${y1}
						`}
					/>
					{this.props.radials.captions ? (
						<text
							className="ptr-aster-chart-grid-radial-caption"
							textAnchor={textAnchor}
							x={textX}
							y={textY}
						>{index + 1}</text>
					) : null}
				</g>
			);
		});
	}
}

export default AsterChart;

