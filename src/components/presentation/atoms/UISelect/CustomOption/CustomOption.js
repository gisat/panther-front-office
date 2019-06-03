import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './CustomOption.css';

class CustomOption extends React.PureComponent {

	static propTypes = {
		color: PropTypes.string,
		key: PropTypes.string,
		label: PropTypes.string,
		type: PropTypes.string,
		value: PropTypes.string,
	};

	constructor(props) {
		super(props);
	}

	render() {
		let content;
		switch (this.props.type){
			case "Urban atlas legend":
				content = this.renderUrbanAtlasLegend();
				break;
			default:
				content = (<div>this.props.label</div>);
				break;
		}
		return content;
	}

	renderUrbanAtlasLegend(){
		let style = {
			backgroundColor: this.props.color
		};

		return (
			<div className="ua-legend-option-content">
				<div className="ua-legend-option-color" style={style}></div>
				<div className="ua-legend-option-text">
					<div className="ua-legend-option-code">{this.props.value}</div>
					<div className="ua-legend-option-name">{this.props.label}</div>
				</div>
			</div>
		);
	}
}

export default CustomOption;
