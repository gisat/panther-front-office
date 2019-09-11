import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import chroma from 'chroma-js';
import _ from 'lodash';
import HoverContext from "../../HoverHandler/context";

import './style.scss';

class ChartLegend extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		data: PropTypes.array,
		keySourcePath: PropTypes.string,
		nameSourcePath: PropTypes.string,
		colorSourcePath: PropTypes.string,
		colorScale: PropTypes.func,
		numericLink: PropTypes.bool
	};

	constructor(props) {
		super(props);
	}

	onMouseMove(itemKey) {
		if (this.context && this.context.onHover) {
			this.context.onHover([itemKey]);
		}
	}

	onMouseOver(itemKey) {
		if (this.context && this.context.onHover) {
			this.context.onHover([itemKey]);
		}
	}

	onMouseOut() {
		if (this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}
	}

	render() {
		return (
			<div className="ptr-chart-legend">
				{_.map(this.props.data, (item, index) => {
					let key = _.get(item, this.props.keySourcePath);
					let color = null;
					if (this.props.colorSourcePath) {
						color = _.get(item, this.props.colorSourcePath);
					} else if (item.color) {
						color = item.color;
					} else if (this.props.colorScale) {
						color = this.props.colorScale(key);
					}

					let name = _.get(item, this.props.nameSourcePath);
					let numericLink = this.props.numericLink ? (index + 1) : null;

					let iconStyle = {
						background: color
					};

					let itemClasses = classnames("ptr-chart-legend-item", {
						withNumbers: !!this.props.numericLink
					});

					let iconClasses = classnames("ptr-chart-legend-item-icon", {
						dark: color ? chroma(color).luminance() < 0.35 : false
					});

					return (
						<div
							className={itemClasses}
							key={key + '-legend'}
							onMouseOver={this.onMouseOver.bind(this, key)}
							onMouseMove={this.onMouseMove.bind(this, key)}
							onMouseOut={this.onMouseOut.bind(this, key)}
						>
							<div className={iconClasses} style={iconStyle}>{numericLink}</div>
							<div className="ptr-chart-legend-item-name" title={name}>{name}</div>
						</div>
					);
				})}
			</div>
		);
	}
}

export default ChartLegend;

