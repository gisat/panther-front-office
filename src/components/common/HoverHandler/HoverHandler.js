import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import HoverContext from './context';
import Popup from "./Popup/Popup";

class HoverHandler extends React.PureComponent {

	static propTypes = {
		selectedItems: PropTypes.array,
		compressedPopups: PropTypes.bool,
		popupContentComponent: PropTypes.element
	};

	constructor(props){
		super(props);
		this.state = {
			hoveredItems: null,
			popup: null
		};

		this.onHover = this.onHover.bind(this);
		this.onHoverOut = this.onHoverOut.bind(this);
	}

	onHover(hoveredItems, options) {
		let update = {};

		if (hoveredItems) {
			update.hoveredItems = hoveredItems;
		}

		if (options && options.popup) {
			update.popup = options.popup;
		}

		if (!_.isEmpty(update)) {
			this.setState(update);
		}
	}

	onHoverOut() {
		this.setState({
			hoveredItems: null,
			popup: null
		});
	}

	render() {
		return (
			<HoverContext.Provider value={{
				hoveredItems: this.state.hoveredItems,
				selectedItems: this.props.selectedItems,
				onHover: this.onHover,
				onHoverOut: this.onHoverOut
			}}>
				{this.props.children}
				{this.state.popup ? this.renderPopup() : null}
			</HoverContext.Provider>
		);
	}

	renderPopup() {
		return <Popup
			x={this.state.popup.x}
			y={this.state.popup.y}
			content={this.props.popupContentComponent ? React.createElement(this.props.popupContentComponent, {data: this.state.popup.data}) : this.state.popup.content}
			compressed={this.props.compressedPopups}
		/>
	}
}

export default HoverHandler;
