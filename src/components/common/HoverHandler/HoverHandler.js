import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import HoverContext from './context';
import Popup from "./Popup/Popup";

class HoverHandler extends React.PureComponent {
	static propTypes = {
		getStyle: PropTypes.func,
		selectedItems: PropTypes.array,
		compressedPopups: PropTypes.bool,
		popupContentComponent: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func
		])
	};

	constructor(props){
		super(props);
		this.ref = React.createRef();
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
		if (options && options.popup && (options.popup.content || options.popup.content === null)) {
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
			if (this.state.data && options.popup.data && options.popup.data.length) {
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
		const {children, selectedItems} = this.props;
		const {hoveredItems, popupContent, data, x, y} = this.state;
		return (
			<HoverContext.Provider value={{
				hoveredItems: hoveredItems,
				selectedItems: selectedItems,
				onHover: this.onHover,
				onHoverOut: this.onHoverOut,
				x: x,
				y: y
			}}>
				<div ref={this.ref} style={{height: '100%',width: '100%'}}>
					{children}
					{/* {popup ? this.renderPopup() : null} */}
					{popupContent || data ? this.renderPopup() : null}
				</div>
			</HoverContext.Provider>
		);
	}

	renderPopup() {
		const {getStyle, popupContentComponent, compressedPopups} = this.props;
		const {data, hoveredItems, fidColumnName, popupContent, x, y} = this.state;

		return <Popup
					x={x}
					y={y}
					content={popupContentComponent ? React.createElement(popupContentComponent, {data: data, featureKeys: hoveredItems, fidColumnName: fidColumnName}) : popupContent}
					getStyle={getStyle}
					hoveredElemen={this.ref.current}
					compressed={compressedPopups}
				/>
	}
}

export default HoverHandler;
