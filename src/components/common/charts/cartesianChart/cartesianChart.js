import React from 'react';
import PropTypes from "prop-types";

export default (WrappedChartComponent) => {
	class CartesianChart extends React.PureComponent {

		static defaultProps = {
			width: 500,
			height: 250,
			maxWidth: 1000,
			minWidth: 150,

			xCaptionsSize: 50,
			yCaptionsSize: 50,

			innerPaddingLeft: 10,
			innerPaddingRight: 10,
			innerPaddingTop: 10
		};

		static propTypes = {
			height: PropTypes.number,
			width: PropTypes.number,
			minWidth: PropTypes.number,
			maxWidth: PropTypes.number,

			minAspectRatio: PropTypes.number,

			xCaptionsSize: PropTypes.number,
			yCaptionsSize: PropTypes.number,

			innerPaddingLeft: PropTypes.number,
			innerPaddingRight: PropTypes.number,
			innerPaddingTop: PropTypes.number,

			xOptions: PropTypes.object,
			xGridlines: PropTypes.bool,
			xCaptions: PropTypes.bool,
			xLabel: PropTypes.bool,
			xTicks: PropTypes.bool,

			yOptions: PropTypes.object,
			yGridlines: PropTypes.bool,
			yCaptions: PropTypes.bool,
			yTicks: PropTypes.bool,
			yLabel: PropTypes.bool,
			withoutYbaseline: PropTypes.bool,
		};

		render() {
			const props = this.props;

			/* dimensions */
			let width = props.width;
			let height = props.height;

			let minWidth = props.minWidth;
			let maxWidth = props.maxWidth;

			let xCaptionsSize = props.xCaptionsSize;
			let yCaptionsSize = props.yCaptionsSize;

			let xLabelSize = 0;
			let yLabelSize = 0;

			if (!props.xCaptions && !props.xCaptionsSize) {
				xCaptionsSize = props.yCaptions ? 10 : 0; // space for labels
			}

			if (!props.yCaptions && !props.yCaptionsSize) {
				yCaptionsSize = props.xCaptions ? 30 : 0; // space for labels
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

			let plotWidth = width - yCaptionsSize - yLabelSize;
			let plotHeight = height - xCaptionsSize - xLabelSize;
			let innerPlotWidth = plotWidth - props.innerPaddingLeft - props.innerPaddingRight;
			let innerPlotHeight = plotHeight - props.innerPaddingTop;



			return (
				<div className="ptr-chart-container">
					<WrappedChartComponent
						{...this.props}
						{...{
							width,
							height,

							minWidth,
							maxWidth,

							xCaptionsSize,
							yCaptionsSize,

							xLabelSize,
							yLabelSize,

							plotWidth,
							plotHeight,

							innerPlotWidth,
							innerPlotHeight
						}}
					/>
				</div>
			);
		}
	}

	return CartesianChart;
};


