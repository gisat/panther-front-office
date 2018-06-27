import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../../utils/utils';
import _ from 'lodash';
import Slider from 'rc-slider';

import Icon from '../../../atoms/Icon';
import './MapEditingTools.css'

class MapEditingTools extends React.PureComponent {

	static propTypes = {
		onCloseClick: PropTypes.func
	};

	constructor(props){
		super(props);
		this.state = {
			open: false
		};

		this.onDotsClick = this.onDotsClick.bind(this);
	}

	onDotsClick(){
		this.setState({
			open: !this.state.open
		});
	}

	render() {
		let classes = classNames("ptr-map-editing-tools",{
			"open": this.state.open
		});

		return (
			<div className={classes}>
				<div className="map-editing-tools-header">
					<div onClick={this.onDotsClick} className="map-editing-icon tools" title="Tools"><Icon icon="dots" /></div>
					<div className="map-editing-name">Urban Atlas</div>
					<div onClick={this.props.onCloseClick} className="map-editing-icon close" tabindex="0">{'\u2715'}</div>
				</div>
				<div className="map-editing-tools-content">
					<div className="map-editing-tool">
						<div className="map-editing-tool-header">Opacity</div>
						<div className="map-editing-tool-body">...slider...</div>
					</div>
				</div>
			</div>
		);
	}

	renderContent(){

	}
}

export default MapEditingTools;
