import React from 'react';
import PropTypes from 'prop-types';

import {Context, Popup} from "@gisatcz/ptr-core";
const SelectContext = Context.getContext('HoverContext');

class SelectHandler extends React.PureComponent {

	static propTypes = {
		selectedItems: PropTypes.array
	};

	constructor(props){
		super(props);

		this.onClick = this.onClick.bind(this);
		this.onHover = this.onHover.bind(this);
		this.onHoverOut = this.onHoverOut.bind(this);

		this.state = {
			data: {
				selectedItems: props.selectedItems,
				onClick: this.onClick,
				onHover: this.onHover,
				onHoverOut: this.onHoverOut
			},
			popup: null
		};
	}

	onClick(selectedItems) {
		this.setState({
			data: {...this.state.data, selectedItems}
		});
	}

	onHover(hoveredItems, options) {
		if (options && options.popup) {
			this.setState({popup:  options.popup});
		}
	}

	onHoverOut() {
		this.setState({
			popup: null
		});
	}

	render() {
		return (
			<SelectContext.Provider value={this.state.data}>
				{this.props.children}
				{this.state.popup ? this.renderPopup() : null}
			</SelectContext.Provider>
		);
	}

	renderPopup() {
		return <Popup
			x={this.state.popup.x}
			y={this.state.popup.y}
			content={this.state.popup.content}
		/>
	}
}

export default SelectHandler;
