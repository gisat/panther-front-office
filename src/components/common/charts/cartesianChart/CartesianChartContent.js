import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import AxisX from '../AxisX';
import AxisY from "../AxisY";


class CartesianChartContent extends React.PureComponent {
	static propTypes = {
		contentData: PropTypes.array,

		xScale: PropTypes.func,
		yScale: PropTypes.func
	};

	render() {
		const props = this.props;

		return (
			<>
				<AxisY
					scale={props.yScale}

					bottomMargin={props.xCaptionsSize}
					topPadding={props.innerPaddingTop}

					height={props.plotHeight}
					plotWidth={props.plotWidth}
					width={props.yCaptionsSize}

					ticks={props.yTicks}
					gridlines={props.yGridlines}
					withCaption={props.yCaptions}
					label={props.yLabel}
					labelSize={props.yLabelSize}
					options={props.yOptions}

					hiddenBaseline={props.withoutYbaseline}
				/>
				<AxisX
					data={props.contentData}
					scale={props.xScale}

					sourcePath={props.xSourcePath}
					keySourcePath={props.keySourcePath}

					leftMargin={props.yCaptionsSize + props.yLabelSize}
					leftPadding={props.innerPaddingLeft}
					height={props.xCaptionsSize}
					plotHeight={props.plotHeight}
					width={props.plotWidth}

					ticks={props.xTicks}
					gridlines={props.xGridlines}
					withCaption={props.xCaptions}
					label={props.xLabel}
					labelSize={props.xLabelSize}
					options={props.xOptions}
				/>
				<g transform={`translate(${props.yCaptionsSize + props.yLabelSize + props.innerPaddingLeft},${props.innerPaddingTop})`}>
					{this.props.children}
				</g>
			</>
		);
	}
}

export default CartesianChartContent;

