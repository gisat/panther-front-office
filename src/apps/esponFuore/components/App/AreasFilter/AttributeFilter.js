import React from "react";
import PropTypes from 'prop-types';
import {createSliderWithTooltip, Range} from 'rc-slider';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const SliderRange = createSliderWithTooltip(Range);

class AttributeFilter extends React.PureComponent {

	static propTypes = {
		activeFilter: PropTypes.object,
		onChange: PropTypes.func,
		min: PropTypes.number,
		max: PropTypes.number
	};

	constructor(props) {
		super(props);
		this.state = {
			range: [this.props.min, this.props.max]
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.activeFilter && !this.props.activeFilter) {
			this.setState({
				range: [this.props.min, this.props.max]
			});
		}
	}

	onChange(range) {
		this.setState({range});
	}

	render() {
		return (
			<SliderRange
				className="esponFuore-attribute-slider"
				onChange={this.onChange.bind(this)}
				onAfterChange={this.props.onChange}
				min={this.props.min}
				max={this.props.max}
				value={this.state.range}
				marks={{
					[this.props.min]: {
						label: this.props.min.toLocaleString(),
						style: {
							left: 0,
							width: 'auto',
							marginLeft: -5
						}

					},
					[this.props.max]: {
						label: this.props.max.toLocaleString(),
						style: {
							right: 0,
							left: 'auto',
							width: 'auto',
							marginLeft: 0,
							marginRight: -5
						}
					}}}
				tipFormatter={(value) => value.toLocaleString()}
			/>
		);
	}
}

export default AttributeFilter;
