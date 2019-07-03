import React from 'react';
import PropTypes from 'prop-types';
import {Rnd} from 'react-rnd';
import './style.scss';

class ResizableContainer extends React.PureComponent {
	static defaultProps = {
		width: 500,
		minWidth: 150
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
		this.setState({width: ref.offsetWidth});
	}

	render() {
		return (
			<div className="ptr-resizable-container">
				<Rnd
					size={{ width: this.state.width}}
					minWidth={this.props.minWidth}
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