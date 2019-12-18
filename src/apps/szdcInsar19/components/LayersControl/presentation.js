import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from "../../../../components/common/atoms/Icon";
import HoldButton from "../../../../components/presentation/atoms/HoldButton";

import './style.scss';

class LayersControl extends React.PureComponent {
	static propTypes = {
		activeLayerKeys: PropTypes.array,
		right: PropTypes.bool,
		layers: PropTypes.array,
		layerTemplates: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();
		this.state = {
			open: false,
			enableMenuClose: true
		};

		this.onControlButtonClick = this.onControlButtonClick.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onMenuMouseDown = this.onMenuMouseDown.bind(this);
	}

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}

	onBlur(e) {
		this.setState({
			enableMenuClose: true,
			open: !this.state.enableMenuClose
		});
	}

	onMenuMouseDown(e) {
		this.setState({
			enableMenuClose: false
		})
	}

	onControlButtonClick() {
		this.setState({
			open: !this.state.open
		});
	}

	onLayerChange(key) {
		const props = this.props;
		if (props.activeLayerKeys) {
			let newActiveKeys = _.includes(props.activeLayerKeys, key) ? _.without(props.activeLayerKeys, key) : _.concat(props.activeLayerKeys, key);
			this.props.onLayersChange(newActiveKeys);
		} else {
			this.props.onLayersChange([key]);
		}
	}

	render() {
		let buttonClasses = classnames("szdcInsar19-layers-control", {
			open: this.state.open
		});

		return (
			<div className={buttonClasses} onBlur={this.onBlur} ref={this.ref}>
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
		let menuClasses = classnames("szdcInsar19-layers-control-menu left", {
			open: this.state.open
		});

		let menuStyle = {
			width: this.state.open ? `10rem` : 0,
			height: this.state.open ? `${this.props.layers.length * 2}rem` : '2rem'
		};

		return (
			<div className={menuClasses} style={menuStyle} onMouseDown={this.onMenuMouseDown}>
				<div className="szdcInsar19-layers-control-menu-content">
					{[...this.props.layers].reverse().map(layer => {
						const template = this.props.layerTemplates[layer.data.layerTemplateKey];

						return (
							<label key={layer.key} className="szdcInsar19-layer-control">
								<input
									type="checkbox"
									onChange={this.onLayerChange.bind(this, layer.key)}
									checked={_.includes(this.props.activeLayerKeys, layer.key)}
								/>
								{template ? template.data.nameDisplay : layer.key}
							</label>
						);
					})}
				</div>
			</div>
		);
	}
}

export default LayersControl;
