import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SelectContext from '../../../components/common/HoverHandler/context';
import Popup from "../../../components/common/HoverHandler/Popup/Popup";

class SelectHandler extends React.PureComponent {

	static propTypes = {
		selectedItems: PropTypes.array
	};

	constructor(props){
		super(props);
		this.state = {
			selectedItems: props.selectedItems,
			hoveredItems: null,
			popup: null
		};

		this.onClick = this.onClick.bind(this);
		this.onHover = this.onHover.bind(this);
		this.onHoverOut = this.onHoverOut.bind(this);
	}

	onClick(selectedItems) {
		this.setState({
			selectedItems
		});
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
			<SelectContext.Provider value={{
				// hoveredItems: this.state.hoveredItems,
				selectedItems: this.state.selectedItems,
				onClick: this.onClick,
				// onHover: this.onHover,
				// onHoverOut: this.onHoverOut
			}}>
				{this.props.children}
				{/*{this.state.popup ? this.renderPopup() : null}*/}
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
