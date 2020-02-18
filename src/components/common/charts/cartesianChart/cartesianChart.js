import React from 'react';
import PropTypes from "prop-types";
import {utils} from '@gisatcz/ptr-utils'

export default (WrappedChartComponent) => {
	class CartesianChart extends React.PureComponent {

		/* sizes in rem */
		static defaultProps = {
			height: 15,
			minWidth: 10,

			xValuesSize: 3,
			yValuesSize: 3,

			innerPaddingLeft: .7,
			innerPaddingRight: .7,
			innerPaddingTop: .7,

			xValues: true,
			yValues: true,

			xTicks: true,

			yGridlines: true
		};

		static propTypes = {
			data: PropTypes.array.isRequired,
			keySourcePath: PropTypes.string.isRequired,
			nameSourcePath: PropTypes.string.isRequired,
			colorSourcePath: PropTypes.string, // only if color is defined in data
			serieDataSourcePath: PropTypes.string, // only if serie
			xSourcePath: PropTypes.string.isRequired, // if serie, path is in context of serie
			ySourcePath: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.array
			]).isRequired, // if serie, path is in context of serie

			sorting: PropTypes.array,

			height: PropTypes.number,
			width: PropTypes.number,
			minWidth: PropTypes.number,
			maxWidth: PropTypes.number,
			minAspectRatio: PropTypes.number,

			xValuesSize: PropTypes.number,
			yValuesSize: PropTypes.number,

			innerPaddingLeft: PropTypes.number,
			innerPaddingRight: PropTypes.number,
			innerPaddingTop: PropTypes.number,

			xOptions: PropTypes.object,
			xGridlines: PropTypes.bool,
			xValues: PropTypes.bool,
			xLabel: PropTypes.bool,
			xScaleType: PropTypes.string,
			xTicks: PropTypes.bool,

			yOptions: PropTypes.object,
			yGridlines: PropTypes.bool,
			yValues: PropTypes.bool,
			yTicks: PropTypes.bool,
			yLabel: PropTypes.bool,
			yScaleType: PropTypes.bool,
			withoutYbaseline: PropTypes.bool,

			// TODO doc
			border: PropTypes.bool,

			diverging: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.bool
			]),

			legend: PropTypes.bool
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
			let content = null;
			let remSize = utils.getRemSize();
			let width = null;
			let paddingAdjustment = 0;

			if (this.props.width || this.state.width) {
				const props = this.props;

				/* dimensions */
				width = (this.props.width ? this.props.width*remSize : this.state.width);
				let height = props.height*remSize;

				let minWidth = props.minWidth*remSize;
				let maxWidth = props.maxWidth*remSize;

				let xValuesSize = props.xValues ? props.xValuesSize*remSize : .5*remSize;
				let yValuesSize = props.yValues ? props.yValuesSize*remSize : .5*remSize;

				if (WrappedChartComponent.defaultProps && WrappedChartComponent.defaultProps.maxPointRadius && this.props.zSourcePath) {
					paddingAdjustment = WrappedChartComponent.defaultProps.maxPointRadius;
				}

				let innerPaddingLeft = props.innerPaddingLeft*remSize + paddingAdjustment;
				let innerPaddingRight = props.innerPaddingRight*remSize + paddingAdjustment;
				let innerPaddingTop = props.innerPaddingTop*remSize + paddingAdjustment;

				let xLabelSize = 0;
				let yLabelSize = 0;

				if (!props.xValues && !props.xValuesSize) {
					xValuesSize = props.yValues ? 1*remSize : 0; // space for labels
				}

				if (!props.yValues && !props.yValuesSize) {
					yValuesSize = props.xValues ? 2*remSize : 0; // space for labels
				}

				if (props.xLabel) {
					xLabelSize = 1*remSize;
				}

				if (props.yLabel) {
					yLabelSize = 1*remSize;
				}

				if (width > maxWidth) width = maxWidth;
				if (width < minWidth) width = minWidth;

				if (props.minAspectRatio && width/height < props.minAspectRatio) {
					height = width/props.minAspectRatio;
				}

				let plotWidth = width - yValuesSize - yLabelSize;
				let plotHeight = height - xValuesSize - xLabelSize;
				let innerPlotWidth = plotWidth - innerPaddingLeft - innerPaddingRight;
				let innerPlotHeight = plotHeight - innerPaddingTop;

				content = (<WrappedChartComponent
					{...this.props}
					{...{
						width,
						height,

						minWidth,
						maxWidth,

						xValuesSize,
						yValuesSize,

						xLabelSize,
						yLabelSize,

						plotWidth,
						plotHeight,

						innerPaddingLeft,
						innerPaddingRight,
						innerPaddingTop,

						innerPlotWidth,
						innerPlotHeight
					}}
				/>);
			}

			let style = {};
			if (width) {
				style.width = width;
			}

			return (
				<div className="ptr-chart-container" ref={this.ref}>
					<div style={style}>
						{content}
					</div>
				</div>
			);
		}
	}

	return CartesianChart;
};


