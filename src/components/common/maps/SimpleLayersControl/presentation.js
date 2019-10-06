import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from "../../atoms/Icon";
import HoldButton from "../../../presentation/atoms/HoldButton";

import './style.scss';

class SimpleLayersControl extends React.PureComponent {
	static propTypes = {
		activeLayer: PropTypes.object,
		layers: PropTypes.array,
		onSelect: PropTypes.func,
		right: PropTypes.bool
	};

	constructor(props) {
		super(props);
		this.state = {
			open: false
		};

		this.onControlButtonClick = this.onControlButtonClick.bind(this);
	}

	onControlButtonClick() {
		this.setState({
			open: !this.state.open
		});
	}

	onLayerTileClick(key, e) {
		e.preventDefault();

		if (this.props.onSelect) {
			this.props.onSelect(key);
		}

		let self = this;
		setTimeout(() => {
			self.setState({
				open: false
			})
		}, 500)
	}

	render() {
		let buttonClasses = classnames("ptr-simple-layers-control control", {
			open: this.state.open
		});

		// TODO replace HoldButton
		return (
			<div className={buttonClasses}>
				<HoldButton
					onClick={this.onControlButtonClick}
				>
					<Icon icon='layers'/>
				</HoldButton>
				{this.renderMenu()}
			</div>
		);
	}

	renderMenu() {
		const layers = this.props.layers;
		const tileWidth = 7;
		const tileHeight = 5;
		const tileMargin = .25;
		const contentMargin = 1;

		if (layers) {
			let grid = this.getGrid(layers.length);

			let menuClasses = classnames("ptr-simple-layers-control-menu", {
				open: this.state.open,
				right: this.props.right,
				left: !this.props.right
			});

			let menuStyle = {
				width: this.state.open ? `${(tileWidth+2*tileMargin)*grid.width + 2*contentMargin}rem` : 0,
				height: this.state.open ? `${(tileHeight+2*tileMargin)*grid.height + 2*contentMargin}rem` : '30px'
			};

			let contentStyle = {
				margin: `${contentMargin}rem`,
				width: `calc(100% - ${2*contentMargin}rem)`,
				height: `calc(100% - ${2*contentMargin}rem)`
			};

			let tileStyle = {
				width: `${tileWidth}rem`,
				height: `${tileHeight}rem`,
				margin: `${tileMargin}rem`
			};

			return (
				<div className={menuClasses} style={menuStyle}>
					<div className="ptr-simple-layers-control-menu-content" style={contentStyle}>
						{layers.map(layer => this.renderTile(layer, tileStyle))}
					</div>
				</div>
			);
		} else {
			return null;
		}
	}

	renderTile(layer, style) {
		let active = layer.key === this.props.activeLayer.key;

		let classes = classnames("ptr-simple-layers-control-tile", {
			active,
		});

		return (
			<div style={style} className={classes} onClick={this.onLayerTileClick.bind(this, layer.key)}>
				<div className="ptr-simple-layers-control-tile-name">{layer.name}</div>
			</div>
		);
	}

	getGrid(count) {
		let width = 1;
		let height = 1;

		// TODO solve 9+ cases
		if (count >= 7) {
			width = 3;
			height = 3;
		} else if (count >= 5) {
			width = 2;
			height = 3;
		} else if (count === 4) {
			width = 2;
			height = 2;
		} else if (count === 3) {
			height = 3;
		} else if (count === 2) {
			height = 2;
		}

		return {width, height}
	}
}

export default SimpleLayersControl;
