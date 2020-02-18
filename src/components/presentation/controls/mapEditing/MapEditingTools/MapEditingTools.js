import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from '@gisatcz/ptr-utils'
import _ from 'lodash';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Icon from '../../../../common/atoms/Icon';
import './MapEditingTools.css';

let polyglot = window.polyglot;

class MapEditingTools extends React.PureComponent {

	static propTypes = {
		onCloseClick: PropTypes.func,
		setOpacity: PropTypes.func,
		opacity: PropTypes.number
	};

	constructor(props){
		super(props);
		this.state = {
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
		this.props.setOpacity(value);
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
						<div className="map-editing-tool-header">{polyglot.t('opacity')}</div>
						<div className="map-editing-tool-body">
							<Slider
								className="map-editing-slider"
								onChange={this.onOpacityChange}
								value={this.props.opacity ? this.props.opacity : 100}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MapEditingTools;
