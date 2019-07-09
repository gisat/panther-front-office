import React from 'react';
import PropTypes from 'prop-types';
import {Rnd} from 'react-rnd';
import './style.scss';
import utils from "../../../../utils/utils";

class ResizableContainer extends React.PureComponent {

	/* Sizes in rem */
	static defaultProps = {
		width: 40,
		minWidth: 10,
		maxWidth: 150
	};

	constructor(props) {
		super(props);
		this.state = {
			width: this.props.width
		};
		this.ref = React.createRef();

		this.resize = this.resize.bind(this);
	}

	resize(e, direction, ref, delta, coord) {
		this.setState({width: ref.offsetWidth/utils.getRemSize()});
	}

	render() {
		const remSize = utils.getRemSize();
		let size = {width: this.state.width*remSize};

		return (
			<div className="ptr-resizable-container">
				<Rnd
					size={size}
					style={{position: 'relative'}}
					minWidth={this.props.minWidth*remSize}
					maxWidth={this.props.maxWidth*remSize}
					onResize={this.resize}
					disableDragging={true}
					bounds='parent'
					default={{
						x: 0,
						y: 0,
						width: this.state.width
					}}
					enableResizing={{ top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
				>
					{React.cloneElement(this.props.children, {width: this.state.width})}
				</Rnd>
			</div>
		);
	}
}

export default ResizableContainer;