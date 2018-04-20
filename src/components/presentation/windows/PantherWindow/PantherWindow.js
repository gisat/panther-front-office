import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './PantherWindow.css';

const DEFAULT_STATE = {
	height: 400,
	width: 300,
	minWidth: 200,
	minHeight: 200,
	positionX: 100,
	positionY: 100,
	name: "Window",
	disableDragging: false,
};

class PantherWindow extends React.PureComponent {

	static propTypes = {
		height: PropTypes.number,
		minHeight: PropTypes.number,
		width: PropTypes.number,
		minWidth: PropTypes.number,
		positionX: PropTypes.number,
		positionY: PropTypes.number,
		name: PropTypes.string,
		id: PropTypes.string,
		disableDragging: PropTypes.bool,
		open: PropTypes.bool,
		onClose: PropTypes.func
	};

	constructor(props){
		super();
		this.state = {...DEFAULT_STATE, ...props}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({...this.state, ...nextProps});
	}

	onDragStop(e, d){
		this.setState({
			positionX: d.x,
			positionY: d.y })
	}

	onResize(e, direction, ref, delta, position){
		this.setState({
			width: ref.offsetWidth,
			height: ref.offsetHeight,
			positionX: position.x,
			positionY: position.y
		});
	}

	render() {
		let style = {
			display: 'none'
		};
		if (this.state.open){
			style.display = 'flex'
		}

		let header = this.renderHeader();
		let content = this.renderContent();

		return (
			<Rnd
				style={style}
				className={'ptr-window'}
				id={this.state.id}
				dragHandleClassName=".ptr-window-header"
				size={{ width: this.state.width,  height: this.state.height }}
				position={{ x: this.state.positionX, y: this.state.positionY }}
				minHeight={this.state.minHeight}
				minWidth={this.state.minWidth}
				maxWidth={'100%'}
				disableDragging={this.state.disableDragging}
				onDragStop={this.onDragStop.bind(this)}
				onResize={this.onResize.bind(this)}>
				{header}
				{content}
			</Rnd>
		);
	}

	renderContent(){
		return <div className="ptr-window-content"></div>
	}

	renderHeader(){
		return (
			<div className="ptr-window-header">
				<div className="ptr-window-title">
					{this.state.name}
				</div>
				<div className="ptr-window-tools">
					<div
						className="ptr-window-tool window-close"
						onClick={this.props.onClose}
					>{'\u2715'}</div>
				</div>
			</div>);
	}

}

export default PantherWindow;
