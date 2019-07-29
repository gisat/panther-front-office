import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import HoverContext from './context';
import Popup from "./Popup/Popup";

class HoverHandler extends React.PureComponent {
	static propTypes = {
		getStyle: PropTypes.func,
	}

	constructor(props){
		super(props);
		this.ref = React.createRef();
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
		const {children} = this.props;
		const {popup, hoveredItems} = this.state;
		return (
			<HoverContext.Provider value={{
				hoveredItems: hoveredItems,
				onHover: this.onHover,
				onHoverOut: this.onHoverOut
			}}>
				<div ref={this.ref} style={{height: '100%',width: '100%'}}>
					{children}
					{popup ? this.renderPopup() : null}
				</div>
			</HoverContext.Provider>
		);
	}

	renderPopup() {
		const {getStyle} = this.props;
		const {popup} = this.state;

		return <Popup
					x={popup.x}
					y={popup.y}
					content={popup.content}
					getStyle={getStyle}
					hoveredElemen={this.ref.current}
				/>
	}
}

export default HoverHandler;
