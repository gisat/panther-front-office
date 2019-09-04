import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3Sankey from 'd3-sankey';
import chroma from 'chroma-js';

import './style.scss';

import utils from "../../../../utils/utils";

import Node from "./Node";
import Link from "./Link";

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

		linkDefaultColor: PropTypes.string,
		linkHighlightedColor: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		linkColorSourcePath: PropTypes.string,
		linkNameSourcePath: PropTypes.string,
		linkValueSourcePath: PropTypes.string.isRequired,
		linkHoverValueSourcePath: PropTypes.string, //path for value to tooltip - by default same like value. Used in relative.

		gradientLinks: PropTypes.bool,
		yOptions: PropTypes.object,
		data: PropTypes.object.isRequired,
		forceMinimum: PropTypes.number,
		forceMaximum: PropTypes.number,
		relative: PropTypes.bool,
		sorting: PropTypes.array,

		colorSourcePath: PropTypes.string,
		keySourcePath: PropTypes.string.isRequired,

		nodeNameSourcePath: PropTypes.string.isRequired,
		nodeHoverNameSourcePath: PropTypes.string,
		nodeValueSourcePath: PropTypes.string.isRequired,
		nodeHoverValueSourcePath: PropTypes.string, //path for value to tooltip - by default same like value. Used in relative.

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
					.extent([[5,5], [width-5, height-5]])
					.nodeId(d => d.id)
					.nodeWidth(20)
					.nodePadding(10)
					.nodeAlign(d3Sankey.sankeyCenter)
					//.iterations(1);  //https://bl.ocks.org/micahstubbs/3c0cb0c0de021e0d9653032784c035e9
		
				let graph = sankey(props.data);

				content = (
					<>
						<svg className="ptr-chart ptr-sankey-chart" height={height} width={width}>
							{props.data && props.gradientLinks ? this.renderGradients(graph.links) : null}
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

	renderGradients(links) {
		const getGradient = (link) => {
			const startColor = link.source.color;
			const stopColor = link.target.color;
			return (<linearGradient key={`${link.index}_${link.value}`} id={`gradient_link_${link.index}_${link.value}`} gradientUnits="userSpaceOnUse">
			{/* // return (<linearGradient key={`${link.index}_${link.value}`} id={`gradient_link_${link.index}_${link.value}`} > */}
				<stop offset={"10%"} stopColor={startColor}></stop>
				<stop offset={"90%"} stopColor={stopColor}></stop>
			</linearGradient>)
		}

		const gradients = links.map(getGradient);
		return (
			<defs>
				{gradients}
			</defs>
		)
	}
	renderLinks(links) {
		const linksElms = links.map((l) => {
			let color = _.get(l, `${this.props.linkColorSourcePath}`);
			let defaultColor = this.props.linkDefaultColor;
			let highlightedColor = this.props.linkHighlightedColor;

			if (this.props.linkColorSourcePath && color) {
				defaultColor = color;
				highlightedColor = chroma(defaultColor).darken(1);
			}

			return (
				<Link
					itemKeys={[`link_${l.index}_${l.value}`]}
					key={`link_${l.index}_${l.value}`}
					strokeWidth={l.width}
					fill={'none'}
					strokeWidth={l.width}
					gradientLinks

					defaultColor={defaultColor}
					highlightedColor={highlightedColor}
					nameSourcePath={this.props.linkNameSourcePath}
					valueSourcePath={this.props.linkValueSourcePath}
					hoverValueSourcePath={this.props.hoverValueSourcePath}
					data={{
						...l
					}}
					yOptions={this.props.yOptions}
					/>
			)
		})

		return (
			<g>{linksElms}</g>
		)
	}

	renderNodes(nodes) {
		const maxNodeDepth = nodes.reduce((max, n) => Math.max(max, n.depth), 0)

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
					itemKeys={[`node_${n.index}_${n.value}`]}
					key={`node_${n.index}_${n.value}`}
					x0={n.x0}
					x1={n.x1}
					y0={n.y0}
					y1={n.y1}
					height={Math.abs(n.y1 - n.y0)}
					width={Math.abs(n.x1 - n.x0)}
					defaultColor={defaultColor}
					highlightedColor={highlightedColor}
					nameSourcePath={this.props.nodeNameSourcePath}
					hoverNameSourcePath={this.props.nodeHoverNameSourcePath}
					valueSourcePath={this.props.nodeValueSourcePath}
					hoverValueSourcePath={this.props.nodeHoverValueSourcePath}
					maxNodeDepth={maxNodeDepth}
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