import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

import './style.scss';
import Segment from "./Segment";
import ChartLegend from "../ChartLegend/ChartLegend";

import utils from "../../../../utils/utils";
import utilsFilter from "../../../../utils/filter";
import utilsSort from "../../../../utils/sort";

const TICK_WIDTH = 8; // in px

class AsterChart extends React.PureComponent {
	static defaultProps = {
		minWidth: 10, // in rem
		maxWidth: 30, // in rem
		padding: 1, // in rem

		grid: true,
		gridGapMin: 1.5, // in rem
		gridStepsMax: 10,
		gridValues: true,

		radials: true,
		radialsLabels: false,
		radialsLabelsSize: 1, // in rem

		startingAngle: Math.PI/2
	};

	static propTypes = {
		data: PropTypes.array.isRequired,
		forceMinimum: PropTypes.number,
		forceMaximum: PropTypes.number,
		relative: PropTypes.bool,
		sorting: PropTypes.array,

		colorSourcePath: PropTypes.string,
		keySourcePath: PropTypes.string.isRequired,
		nameSourcePath: PropTypes.string.isRequired,
		valueSourcePath: PropTypes.string.isRequired,
		hoverValueSourcePath: PropTypes.string, //path for value to tooltip - by default same like value. Used in relative.

		width: PropTypes.number,
		minWidth: PropTypes.number,
		maxWidth: PropTypes.number,
		padding: PropTypes.number,

		grid: PropTypes.bool,
		gridGapMin: PropTypes.number,
		gridStepsMax: PropTypes.number,
		gridValues: PropTypes.bool,

		radials: PropTypes.bool,
		radialsLabels: PropTypes.bool,
		radialsLabelsSize: PropTypes.number,

		startingAngle: PropTypes.number,

		legend: PropTypes.bool,
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();
		this.state = {
			width: null
		}
	}

	componentDidMount() {
		this.resize();
		if (window) window.addEventListener('resize', this.resize.bind(this), {passive: true}); //todo IE
	}

	resize() {
		if (!this.props.width && this.ref && this.ref.current) {
			let pxWidth = this.ref.current.clientWidth;

			this.setState({
				width: pxWidth
			});
		}
	}

	render() {
		const props = this.props;
		let remSize = utils.getRemSize();

		let content, data, width  = null;
		if (this.props.width || this.state.width) {

			/* dimensions */
			width = this.props.width ? this.props.width*remSize : this.state.width;

			let minWidth = props.minWidth*remSize;
			let maxWidth = props.maxWidth*remSize;

			if (width > maxWidth) width = maxWidth;
			if (width < minWidth) width = minWidth;

			let padding = (props.radials && props.radialsLabels ? props.padding + props.radialsLabelsSize : props.padding) * remSize;

			let innerWidth = width - 2*padding;

			/* data preparation */
			let values = [];

			if (props.data) {
				data = utilsFilter.filterDataWithNullValue(props.data, props.valueSourcePath);
				data = props.sorting ? utilsSort.sortByOrder(data, props.sorting) : data;

				/* ensure colors */
				data = _.map(data, item => {
					let color = chroma.random().hex();
					if (!props.colorSourcePath && !item.color) {
						item.color = color;
					} else {
						let definedColor = _.get(item, this.props.colorSourcePath);
						if (!definedColor) {
							_.set(item, this.props.colorSourcePath, color);
						}
					}

					return item;
				});

				values = _.map(data, (item) => {return _.get(item, props.valueSourcePath)});
			}

			let maximum = props.forceMaximum || props.forceMaximum === 0 ? props.forceMaximum : _.max(values);
			let minimum = _.min(values);

			/* The minimum should be 0 by default if the minimal value is 0 or positive. Otherwise reduce the minimum by 5 % of the values range to ensure some height for the smallest segment. */
			if (props.forceMinimum || props.forceMinimum === 0) {
				minimum = props.forceMinimum;
			} else if (minimum >= 0) {
				minimum = 0;
			} else {
				minimum = minimum - Math.abs(maximum - minimum)*0.05;
			}

			let origin = [width/2, width/2];
			let domain = [minimum, maximum];

			let scale = d3
				.scaleLinear()
				.domain(domain)
				.range([0, innerWidth/2]);

			content = (
				<>
					<svg className="ptr-chart ptr-aster-chart" height={width}>
						{data && props.radials ? this.renderRadials(data, origin, scale, maximum) : null};
						{data ? this.renderSegments(data, origin, scale, maximum) : null}
						{props.grid ? this.renderGrid(domain, origin, scale, width) : null}
					</svg>
				</>
			);
		}

		let style = {};
		if (width) {
			style.width = width;
		}

		return (
			<div className="ptr-chart-container centered" ref={this.ref}>
				<div style={style}>
					{content}
				</div>
				{this.props.legend && data ? this.renderLegend(data, props.radials && props.radialsLabels) : null}
			</div>
		);
	}

	renderSegments(data, origin, scale, maximum) {
		let segmentAngle = 2*Math.PI/data.length;
		let strokeWidth = data.length < 20 ? 2 : 1;
		let siblings = data.map((item) => _.get(item, this.props.keySourcePath));

		return _.map(data, (segment, index) => {
			let key = _.get(segment, this.props.keySourcePath);
			let color = this.props.colorSourcePath ? _.get(segment, this.props.colorSourcePath) : segment.color;

			let radius = scale(_.get(segment, this.props.valueSourcePath)) + strokeWidth;
			let startAngle = this.props.startingAngle + index * segmentAngle;
			let endAngle = this.props.startingAngle + (index+1) * segmentAngle;

			let x0 = origin[0] - Math.cos(startAngle) * radius;
			let y0 = origin[1] - Math.sin(startAngle) * radius;

			let x1 = origin[0] - Math.cos(endAngle) * radius;
			let y1 = origin[1] - Math.sin(endAngle) * radius;

			let maxRadius = scale(maximum);

			let x0max = origin[0] - Math.cos(startAngle) * maxRadius;
			let y0max = origin[1] - Math.sin(startAngle) * maxRadius;
			let x1max = origin[0] - Math.cos(endAngle) * maxRadius;
			let y1max = origin[1] - Math.sin(endAngle) * maxRadius;

			return (
				<Segment
					key={key}
					itemKey={key}
					origin={origin}
					arcStart={[x0, y0]}
					arcEnd={[x1, y1]}
					radius={radius}

					maxArcStart={[x0max, y0max]}
					maxArcEnd={[x1max, y1max]}
					maxRadius={maxRadius}

					defaultColor={color}
					highlightedColor={color}
					strokeWidth={strokeWidth}

					nameSourcePath={this.props.nameSourcePath}
					valueSourcePath={this.props.valueSourcePath}
					hoverValueSourcePath={this.props.hoverValueSourcePath || this.props.valueSourcePath}
					data={segment}
					relative={this.props.relative}
					siblings={siblings}
				/>
			);
		});
	}

	renderGrid(domain, origin, scale, width) {
		const props = this.props;

		let numOfSteps = props.gridStepsMax;
		let gap = props.gridGapMin * utils.getRemSize();

		let min = domain[0];
		let max = domain[1];

		// adjust the number of steps according to chart height
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
					props.gridValues ? (
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
		let maxRadius = this.props.radialsLabels ? scale(maximum) + TICK_WIDTH : scale(maximum);
		let maxTextRadius = scale(maximum) + 2*TICK_WIDTH;

		return _.map(data, (segment, index) => {
			let key = _.get(segment, this.props.keySourcePath) + "-radial";
			let angle = this.props.startingAngle + (index * segmentAngle) + segmentAngle/2;
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
					{this.props.radialsLabels ? (
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

	renderLegend(data, numericLink) {
		return (
			<ChartLegend
				data={data}
				keySourcePath={this.props.keySourcePath}
				nameSourcePath={this.props.nameSourcePath}
				colorSourcePath={this.props.colorSourcePath}
				numericLink={numericLink}
			/>
		);
	}
}

export default AsterChart;

