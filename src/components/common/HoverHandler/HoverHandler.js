import React from 'react';
import PropTypes from 'prop-types';

import HoverContext from './context';

class HoverHandler extends React.PureComponent {

	static propTypes = {
	};

	constructor(props){
		super(props);
		this.state = {
			hoveredAreas: null
		};

		this.onHover = this.onHover.bind(this);
		this.onHoverOut = this.onHoverOut.bind(this);
	}

	onHover(hoveredAreas) {
		this.setState({hoveredAreas});
	}

	onHoverOut() {
		this.setState({
			hoveredAreas: null
		});
	}

	render() {
		return (
			<HoverContext.Provider value={{
				hoveredAreas: this.state.hoveredAreas,
				onHover: this.onHover,
				onHoverOut: this.onHoverOut
			}}>
				{this.props.children}
			</HoverContext.Provider>
		);
	}
}

export default HoverHandler;
