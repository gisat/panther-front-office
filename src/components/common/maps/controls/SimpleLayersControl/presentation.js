import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from "../../../atoms/Icon";
import HoldButton from "../../../../presentation/atoms/HoldButton";

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

		this.ref = React.createRef();
		this.state = {
			open: false
		};

		this.onControlButtonClick = this.onControlButtonClick.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentWillUnmount() {
		this.stopHandlingClickOutside();
	}

	startHandlingClickOutside() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	stopHandlingClickOutside() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside(event) {
		const wrapperRef = this.ref && this.ref.current;
		const isOpen = this.state.open;
		if (isOpen && wrapperRef && !wrapperRef.contains(event.target)) {
		this.close();
		}
	}

	close() {
		this.stopHandlingClickOutside();
		this.setState({open: false});
	}

	open() {
		this.startHandlingClickOutside();
		this.setState({open: true});
	}

	onControlButtonClick() {
		const isOpen = this.state.open;
		if(isOpen) {
			this.close();
		} else {
			this.open();
		}

	}

	onLayerTileClick(key) {
		if (this.props.onSelect) {
			this.props.onSelect(key);
		}
	}

	render() {
		let buttonClasses = classnames("ptr-simple-layers-control control", {
			open: this.state.open
		});

		// TODO replace HoldButton
		return (
			<div className={buttonClasses} ref={this.ref}>
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
				height: this.state.open ? `${(tileHeight+2*tileMargin)*grid.height + 2*contentMargin}rem` : '2rem'
			};

			let contentStyle = {
				margin: `${contentMargin}rem`,
				width: `calc(100% - ${2*contentMargin}rem)`,
				height: `calc(100% - ${2*contentMargin}rem)`
			};

			return (
				<div className={menuClasses} style={menuStyle}>
					<div className="ptr-simple-layers-control-menu-content" style={contentStyle}>
						{layers.map(layer => this.renderTile(layer, tileWidth, tileHeight, tileMargin))}
					</div>
				</div>
			);
		} else {
			return null;
		}
	}

	renderTile(layer, width, height, margin) {
		let active = layer.key === this.props.activeLayer.key;

		let classes = classnames("ptr-simple-layers-control-tile", {
			active,
		});

		let style = {
			width: `${width}rem`,
			height: `${height}rem`,
			margin: `${margin}rem`
		};

		if (layer.thumbnail) {
			// TODO check type of thumbnail
			style.backgroundImage = `url(${require('./img/' + layer.thumbnail + '.png')})`;
		}

		return (
			<div key={layer.key} style={style} className={classes} onClick={this.onLayerTileClick.bind(this, layer.key)}>
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
