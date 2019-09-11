import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import AxisX from '../AxisX';
import AxisY from "../AxisY";


class CartesianChartContent extends React.PureComponent {
	static propTypes = {
		contentData: PropTypes.array,
		aggregated: PropTypes.bool,

		xScale: PropTypes.func,
		yScale: PropTypes.func
	};

	render() {
		const props = this.props;

		return (
			<>
				<AxisY
					scale={props.yScale}

					bottomMargin={props.xValuesSize}
					topPadding={props.innerPaddingTop}
					leftPadding={props.innerPaddingLeft}

					height={props.plotHeight}
					plotWidth={props.plotWidth}
					width={props.yValuesSize}

					ticks={props.yTicks}
					gridlines={props.yGridlines}
					withValues={props.yValues}
					label={props.yLabel}
					labelSize={props.yLabelSize}
					options={props.yOptions}

					diverging={props.diverging}
					stacked={props.stacked}
					xScale={props.xScale}
					xOptions={props.xOptions}

					hiddenBaseline={props.withoutYbaseline}
				/>
				<AxisX
					data={props.contentData}
					scale={props.xScale}

					sourcePath={props.xSourcePath}
					keySourcePath={props.keySourcePath}

					leftMargin={props.yValuesSize + props.yLabelSize}
					leftPadding={props.innerPaddingLeft}
					topPadding={props.innerPaddingTop}

					height={props.xValuesSize}
					plotHeight={props.plotHeight}
					width={props.plotWidth}

					ticks={props.xTicks && !props.aggregated}
					gridlines={props.xGridlines && !props.aggregated}
					withValues={props.xValues}
					label={props.xLabel}
					labelSize={props.xLabelSize}
					options={props.xOptions}

					diverging={props.diverging}

					yScale={props.yScale}
					yOptions={props.yOptions}
				/>
				<g transform={`translate(${props.yValuesSize + props.yLabelSize + props.innerPaddingLeft},${props.innerPaddingTop})`}>
					{this.props.children}
				</g>
			</>
		);
	}
}

export default CartesianChartContent;

