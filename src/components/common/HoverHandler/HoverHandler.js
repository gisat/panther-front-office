import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import HoverContext from './context';
import Popup from "./Popup/Popup";

class HoverHandler extends React.PureComponent {

	static propTypes = {
		selectedItems: PropTypes.array,
		compressedPopups: PropTypes.bool,
		popupContentComponent: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func
		])
	};

	constructor(props){
		super(props);
		this.state = {
			hoveredItems: [],
			popupContent: null,
			x: null,
			y: null,
			data: null
		};

		this.onHover = this.onHover.bind(this);
		this.onHoverOut = this.onHoverOut.bind(this);
	}

	onHover(hoveredItems, options) {
		// TODO what is wrong with attributes? Just bad signal? Else try single layer

		// TODO check popup coordinates -> if the same -> merge data / else -> overwrite
		// TODO if empty hovered items && nothing in state -> set state with nulls

		let update = {};
		let coordChanged = false;

		// for older versions compatibility
		if (options && options.popup && options.popup.content) {
			update.popupContent = options.popup.content;
		}

		// check if coordinates has been changed
		if (options.popup.x && options.popup.y) {
			if (this.state.x !== options.popup.x || this.state.y !== options.popup.y) {
				coordChanged = true;
				update.x = options.popup.x;
				update.y = options.popup.y;
			}
		}


		// handle data according to coordinates change
		// TODO fid column name should be part of data
		if (coordChanged) {
			update.hoveredItems = hoveredItems;
			update.data = options.popup.data;
			update.fidColumnName = options.popup.fidColumnName;
		} else {
			update.hoveredItems = [...this.state.hoveredItems, ...hoveredItems];
			if (options.popup.data && options.popup.data.length) {
				update.data = [...this.state.data, ...options.popup.data];
				update.fidColumnName = options.popup.fidColumnName;
			}
		}

		if (!_.isEmpty(update)) {
			if (update.hoveredItems && update.hoveredItems.length) {
				this.setState(update);
			} else {
				this.onHoverOut();
			}
		}
	}

	onHoverOut() {
		this.setState({
			hoveredItems: [],
			popupContent: null,
			data: null,
			fidColumnName: null
		});
	}

	render() {
		return (
			<HoverContext.Provider value={{
				hoveredItems: this.state.hoveredItems,
				selectedItems: this.props.selectedItems,
				onHover: this.onHover,
				onHoverOut: this.onHoverOut,
				x: this.state.x,
				y: this.state.y
			}}>
				{this.props.children}
				{this.state.popupContent || this.state.data ? this.renderPopup() : null}
			</HoverContext.Provider>
		);
	}

	renderPopup() {
		return <Popup
			x={this.state.x}
			y={this.state.y}
			content={this.props.popupContentComponent ? React.createElement(this.props.popupContentComponent, {data: this.state.data, featureKeys: this.state.hoveredItems, fidColumnName: this.state.fidColumnName}) : this.state.popupContent}
			compressed={this.props.compressedPopups}
		/>
	}
}

export default HoverHandler;
