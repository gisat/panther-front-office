import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Icon from '../../../atoms/Icon';
import './MapEditingTools.css'

class MapEditingTools extends React.PureComponent {

	static propTypes = {
		onCloseClick: PropTypes.func
	};

	constructor(props){
		super(props);
		this.state = {
			opacityValue: 100,
			open: false
		};

		this.onDotsClick = this.onDotsClick.bind(this);
		this.onOpacityChange = this.onOpacityChange.bind(this);
	}

	onDotsClick(){
		this.setState({
			open: !this.state.open
		});
	}

	onOpacityChange(value){
		this.setState({
			opacityValue: value
		});
	}

	render() {
		let classes = classNames("ptr-map-editing-tools",{
			"open": this.state.open
		});

		let contentStyle = {
			height: this.state.open ? '5rem' : 0
		};

		return (
			<div className={classes}>
				<div className="map-editing-tools-header">
					<div onClick={this.onDotsClick} className="map-editing-icon tools" title="Tools"><Icon icon="dots" /></div>
					<div className="map-editing-name">Urban Atlas</div>
					<div onClick={this.props.onCloseClick} className="map-editing-icon close" tabIndex="0">{'\u2715'}</div>
				</div>
				<div className="map-editing-tools-content" style={contentStyle}>
					<div className="map-editing-tool">
						<div className="map-editing-tool-header">Opacity</div>
						<div className="map-editing-tool-body">
							<Slider
								className="map-editing-slider"
								onChange={this.onOpacityChange}
								value={this.state.opacityValue}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MapEditingTools;
