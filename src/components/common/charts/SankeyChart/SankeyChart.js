import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import chroma from 'chroma-js';

import './style.scss';

import utils from "../../../../utils/utils";

import Node from "./Node";

const TICK_WIDTH = 8; // in px

class SankeyChart extends React.PureComponent {
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
		nodeDefaultColor: PropTypes.string,
		nodeHighlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		nodeColorSourcePath: PropTypes.string,
		yOptions: PropTypes.object,
		data: PropTypes.object.isRequired,
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
		height: PropTypes.number,
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
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();
		this.state = {
			width: null,
			height: null,
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

		let content, data, width, height  = null;
		if (this.props.width || this.state.width) {

			/* dimensions */
			width = this.props.width ? this.props.width*remSize : this.state.width;
			height = this.props.height ? this.props.height*remSize : this.state.height;

			let minWidth = props.minWidth*remSize;
			let maxWidth = props.maxWidth*remSize;

			if (width > maxWidth) width = maxWidth;
			if (width < minWidth) width = minWidth;

			// let padding = (props.radials && props.radialsLabels ? props.padding + props.radialsLabelsSize : props.padding) * remSize;
			let padding = props.padding * remSize;

			let innerWidth = width - 2*padding;

			/* data preparation */
			let values = [];

			if (props.data) {

				//TODO -> to props
				const sankey = d3Sankey.sankey()
					.size([width, height])
					.nodeId(d => d.id)
					.nodeWidth(20)
					.nodePadding(10)
					.nodeAlign(d3Sankey.sankeyCenter);
		
				let graph = sankey(props.data);

				content = (
					<>
						<svg className="ptr-chart ptr-sankey-chart" height={height}>
							{props.data ? this.renderLinks(graph.links) : null}
							{props.data ? this.renderNodes(graph.nodes) : null}
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
				</div>
			);
		}
	}

	renderLinks(links) {
		let d = d3Sankey.sankeyLinkHorizontal()
		
		const linksElms = links.map((l) => {
			return (
					<path
						key={l.index}
						d={d(l)}
						strokeWidth={l.width}
						fill={'none'}
						strokeOpacity={0.5}
						stroke={'red'}
						/>)
		})

		return (
			<g>{linksElms}</g>
		)
	}

	renderNodes(nodes) {
		
		const nodesElms = nodes.map((n) => {
			let color = _.get(n, `${this.props.nodeColorSourcePath}`);
			let defaultColor = this.props.nodeDefaultColor;
			let highlightedColor = this.props.nodeHighlightedColor;

			if (this.props.nodeColorSourcePath && color) {
				defaultColor = color;
				highlightedColor = chroma(defaultColor).darken(1);
			}

			return (
				<Node
					itemKeys={[n.index]}
					key={`${n.index}_${n.value}`}
					x0={n.x0}
					x1={n.x1}
					y0={n.y0}
					y1={n.y1}
					height={Math.abs(n.y1 - n.y0)}
					width={Math.abs(n.x1 - n.x0)}
					defaultColor={defaultColor}
					highlightedColor={highlightedColor}
					nameSourcePath={this.props.nameSourcePath}
					valueSourcePath={this.props.valueSourcePath}
					hoverValueSourcePath={this.props.hoverValueSourcePath}
					data={{
						...n
					}}
					yOptions={this.props.yOptions}
					/>
			)
		})

		return (
			<g>{nodesElms}</g>
		)
	}
}

export default SankeyChart;