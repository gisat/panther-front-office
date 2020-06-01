import React from "react";
import PropTypes from 'prop-types';
import 'rc-input-number/assets/index.css';
import InputNumber from 'rc-input-number';
import {createSliderWithTooltip, Range} from 'rc-slider';

import 'rc-slider/assets/index.css';

const SliderRange = createSliderWithTooltip(Range);

class AttributeFilter extends React.PureComponent {

	static propTypes = {
		activeFilter: PropTypes.object,
		onChange: PropTypes.func,
		min: PropTypes.number,
		max: PropTypes.number,
		range: PropTypes.array
	};

	constructor(props) {
		super(props);
		this.state = {
			range: this.props.range ? this.props.range :  [this.props.min, this.props.max]
		};

		this.onInputMinChange = this.onInputMinChange.bind(this);
		this.onInputMaxChange = this.onInputMaxChange.bind(this);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.activeFilter && !this.props.activeFilter) {
			this.setState({
				range: [this.props.min, this.props.max]
			});
		} else if (prevProps.min !== this.props.min || prevProps.max !== this.props.max) {
			this.setState({
				range: [this.props.min, this.props.max]
			});
		}
	}

	onChange(range) {
		this.setState({range});
	}

	onInputMinChange(min) {
		if (Math.abs(min - this.state.range[0]) > 0.001) {
			if (min < this.props.min) {
				min = this.props.min;
			} else if (min > this.props.max) {
				min = this.props.max;
			}

			let range = [min, this.state.range[1]];
			if (min > this.state.range[1]) {
				range = [this.state.range[1], this.state.range[1]]
			}

			this.setState({range});
			this.props.onChange(range);
		}
	}

	onInputMaxChange(max) {
		if (Math.abs(max - this.state.range[1]) > 0.001) {
			if (max < this.props.min) {
				max = this.props.min;
			} else if (max > this.props.max) {
				max = this.props.max;
			}

			let range = [this.state.range[0], max];
			if (max < this.state.range[0]) {
				range = [this.state.range[0], this.state.range[0]]
			}

			this.setState({range});
			this.props.onChange(range);
		}
	}

	isRangeDecimal() {
		return (this.props.max % 1 !== 0) || (this.props.min % 1 !== 0);
	}

	render() {
		return (
			this.props.min && this.props.max ? (
				<div className="esponFuore-attribute-filter">
					<SliderRange
						className="esponFuore-attribute-slider"
						onChange={this.onChange.bind(this)}
						onAfterChange={this.props.onChange}
						min={this.props.min}
						max={this.props.max}
						value={this.state.range}
						step={this.isRangeDecimal() ? 0.001:1}
						marks={{
							[this.props.min]: {
								label: this.props.min.toLocaleString(),
								style: {
									left: 0,
									width: 'auto',
									marginLeft: -7
								}

							},
							[this.props.max]: {
								label: this.props.max.toLocaleString(),
								style: {
									right: 0,
									left: 'auto',
									width: 'auto',
									marginLeft: 0,
									marginRight: -7
								}
							}}}
						tipFormatter={(value) => value.toLocaleString()}
					/>
					<div className="esponFuore-attribute-filter-inputs">
						<InputNumber
							defaultValue={this.props.min}
							value={this.state.range[0]}
							precision={this.isRangeDecimal() ? 3:0}
							onChange={this.onInputMinChange}
						/>
						<div className="esponFuore-attribute-filter-input-separator">-</div>
						<InputNumber
							defaultValue={this.props.max}
							value={this.state.range[1]}
							precision={this.isRangeDecimal() ? 3:0}
							onChange={this.onInputMaxChange}
						/>
					</div>
				</div>
			) : null
		);
	}
}

export default AttributeFilter;
