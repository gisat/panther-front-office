import React from 'react';

import hoverContext from '../HoverHandler/context';


class TimelineHover extends React.PureComponent {
	static contextType = hoverContext;
	constructor (props) {
		super(props);
		this.onHover = this.onHover.bind(this);
	}

	onHover(evt) {
		if(evt) {
			this.context.onHover('timeline', {
				popup: {
					x: evt.x,
					y: evt.y,
					content: this.props.getHoverContent(evt.x, evt.time) || null
				}
			})
		} else {
			this.context.onHoverOut()
		}
	}

	render() {
		const children = React.Children.map(this.props.children, child =>
			React.cloneElement(child, { ...child.props,  onHover: this.onHover}));

		return (<>{children}</>)
	}

}

export default TimelineHover;
