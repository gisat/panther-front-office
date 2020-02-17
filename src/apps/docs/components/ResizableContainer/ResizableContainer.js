import React from 'react';
import PropTypes from 'prop-types';
import {Rnd} from 'react-rnd';
import './style.scss';
import {utils} from "panther-utils"

class ResizableContainer extends React.PureComponent {

	/* Sizes in rem */
	static defaultProps = {
		width: 40,
		minWidth: 10,
		maxWidth: null
	};

	constructor(props) {
		super(props);
		this.state = {
			width: this.props.width
		};
		this.ref = React.createRef();

		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		let self = this;
		setTimeout(() => {
			let maxWidth = self.ref.current.offsetWidth/utils.getRemSize();
			if (maxWidth < self.state.width) {
				self.setState({width: maxWidth});
			}
		}, 100);
	}

	resize(e, direction, ref, delta, coord) {
		this.setState({width: ref.offsetWidth/utils.getRemSize()});
	}

	render() {
		const remSize = utils.getRemSize();
		let size = {width: this.state.width*remSize};

		return (
			<div className="ptr-resizable-container" ref={this.ref}>
				<Rnd
					size={size}
					style={{position: 'relative'}}
					minWidth={this.props.minWidth*remSize}
					maxWidth={this.props.maxWidth ? this.props.maxWidth*remSize : '100%'}
					onResize={this.resize}
					disableDragging={true}
					bounds='parent'
					default={{
						x: 0,
						y: 0,
						width: '100%'
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