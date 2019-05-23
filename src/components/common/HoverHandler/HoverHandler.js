import React from 'react';
import PropTypes from 'prop-types';

import HoverContext from './context';

class HoverHandler extends React.PureComponent {

	static propTypes = {
	};

	constructor(props){
		super(props);
		this.state = {
			hoveredItems: null
		};

		this.onHover = this.onHover.bind(this);
		this.onHoverOut = this.onHoverOut.bind(this);
	}

	onHover(hoveredItems) {
		this.setState({hoveredItems});
	}

	onHoverOut() {
		this.setState({
			hoveredItems: null
		});
	}

	render() {
		return (
			<HoverContext.Provider value={{
				hoveredItems: this.state.hoveredItems,
				onHover: this.onHover,
				onHoverOut: this.onHoverOut
			}}>
				{this.props.children}
			</HoverContext.Provider>
		);
	}
}

export default HoverHandler;
