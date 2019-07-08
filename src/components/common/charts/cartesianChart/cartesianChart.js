import React from 'react';
import PropTypes from "prop-types";

export default (WrappedChartComponent) => {
	class CartesianChart extends React.PureComponent {

		static defaultProps = {
			height: 250,
			minWidth: 150,

			xValuesSize: 50,
			yValuesSize: 50,

			innerPaddingLeft: 10,
			innerPaddingRight: 10,
			innerPaddingTop: 10,

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
			ySourcePath: PropTypes.string.isRequired, // if serie, path is in context of serie

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
			xTicks: PropTypes.bool,

			yOptions: PropTypes.object,
			yGridlines: PropTypes.bool,
			yValues: PropTypes.bool,
			yTicks: PropTypes.bool,
			yLabel: PropTypes.bool,
			withoutYbaseline: PropTypes.bool,

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
				this.setState({
					width: this.ref.current.clientWidth
				});
			}
		}

		render() {
			let content = null;

			if (this.props.width || this.state.width) {
				const props = this.props;

				/* dimensions */
				let width = this.props.width ? this.props.width : this.state.width;
				let height = props.height;

				let minWidth = props.minWidth;
				let maxWidth = props.maxWidth;

				let xValuesSize = props.xValuesSize;
				let yValuesSize = props.yValuesSize;

				let xLabelSize = 0;
				let yLabelSize = 0;

				if (!props.xValues && !props.xValuesSize) {
					xValuesSize = props.yValues ? 10 : 0; // space for labels
				}

				if (!props.yValues && !props.yValuesSize) {
					yValuesSize = props.xValues ? 30 : 0; // space for labels
				}

				if (props.xLabel) {
					xLabelSize = 20;
				}

				if (props.yLabel) {
					yLabelSize = 20;
				}

				if (width > maxWidth) width = maxWidth;
				if (width < minWidth) width = minWidth;

				if (props.minAspectRatio && width/height < props.minAspectRatio) {
					height = width/props.minAspectRatio;
				}

				let plotWidth = width - yValuesSize - yLabelSize;
				let plotHeight = height - xValuesSize - xLabelSize;
				let innerPlotWidth = plotWidth - props.innerPaddingLeft - props.innerPaddingRight;
				let innerPlotHeight = plotHeight - props.innerPaddingTop;

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

						innerPlotWidth,
						innerPlotHeight
					}}
				/>);
			}

			return (
				<div className="ptr-chart-container" ref={this.ref}>
					{content}
				</div>
			);
		}
	}

	return CartesianChart;
};


