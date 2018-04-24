import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import './Window.css';

const DEFAULT_FLOATER_WIDTH = 400;
const DEFAULT_FLOATER_HEIGHT = 500;
const DEFAULT_FLOATER_X = 100;
const DEFAULT_FLOATER_Y = 100;

const DEFAULT_STATE = {
	height: DEFAULT_FLOATER_HEIGHT,
	width: DEFAULT_FLOATER_WIDTH,
	positionX: DEFAULT_FLOATER_X,
	positionY: DEFAULT_FLOATER_Y,
	open: false,
	floating: true
};

class PantherWindow extends React.PureComponent {

	static propTypes = {
		height: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		minHeight: PropTypes.number,
		width: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		minWidth: PropTypes.number,
		positionX: PropTypes.number,
		positionY: PropTypes.number,
		name: PropTypes.string,
		elementId: PropTypes.string,
		floatable: PropTypes.bool,
		floating: PropTypes.bool,
		open: PropTypes.bool,
		onClose: PropTypes.func,
		onShrink: PropTypes.func,
		onExpand: PropTypes.func,
		onDragStop: PropTypes.func,
		onResize: PropTypes.func
	};

	static defaultProps = {
		floatable: true,
		name: "Window",
		minWidth: 200,
		minHeight: 200
	};

	constructor(props){
		super(props);
		this.state = {...DEFAULT_STATE, ..._.pick(props, ['width', 'height', 'open', 'floating', 'positionX', 'positionY'])};
	}

	componentWillReceiveProps(nextProps) {
		let nextState = {...this.state, ..._.pick(nextProps, ['width', 'height', 'open', 'floating', 'positionX', 'positionY'])};
		this.setState(nextState);
	}

	onDragStop(e, d){
		this.props.onDragStop({
			positionX: d.x,
			positionY: d.y
		});
	}

	onExpand(){
		this.props.onExpand();
	}

	onResize(e, direction, ref, delta, position){
		this.props.onResize({
			width: ref.offsetWidth,
			height: ref.offsetHeight,
			positionX: position.x,
			positionY: position.y
		});
	}

	onShrink(){
		this.props.onShrink();
	}

	render() {
		let classes = classnames(`ptr-window ${this.props.elementId}`,{
			'floating': this.state.floating,
			'open': this.state.open
		});
		let style = {
			display: 'none'
		};

		let disableDragging = true;
		let enableResizing = false;
		if (this.state.floating){
			disableDragging = false;
			enableResizing = true;
		}


		if (this.state.open){
			style.display = 'flex'
		}

		let header = this.renderHeader();
		let content = this.renderContent();

		return (
			<Rnd
				style={style}
				className={classes}
				dragHandleClassName=".ptr-window-header"
				size={this.state.floating ? { width: this.state.width,  height: this.state.height } : {width: '100%', height: '100%'}}
				position={this.state.floating ? { x: this.state.positionX, y: this.state.positionY } : {x: 0, y: 0}}
				minHeight={this.props.minHeight}
				minWidth={this.props.minWidth}
				maxWidth={'100%'}
				disableDragging={disableDragging}
				enableResizing={{
					bottom: enableResizing,
					bottomLeft: enableResizing,
					bottomRight: enableResizing,
					left: enableResizing,
					right: enableResizing,
					top: enableResizing,
					topLeft: enableResizing,
					topRight: enableResizing
				}}
				onDragStop={this.onDragStop.bind(this)}
				onResize={this.onResize.bind(this)}>
				{header}
				{content}
			</Rnd>
		);
	}

	renderContent(){
		return <div className="ptr-window-content">{this.props.children}</div>
	}

	renderHeader(){
		let floatingSwitch;
		if (this.props.floatable && this.state.floating){
			floatingSwitch = (<div
				className="ptr-window-tool window-expand"
				onClick={this.onExpand.bind(this)}
			>Expand</div>);
		} else if (this.props.floatable && !this.state.floating){
			floatingSwitch = (<div
				className="ptr-window-tool window-shrink"
				onClick={this.onShrink.bind(this)}
			>Shrink</div>);
		}

		return (
			<div className="ptr-window-header">
				<div className="ptr-window-title">
					{this.props.name}
				</div>
				<div className="ptr-window-tools">
					{floatingSwitch}
					<div
						className="ptr-window-tool window-close"
						onClick={this.props.onClose}
					>{'\u2715'}</div>
				</div>
			</div>);
	}

}

export default PantherWindow;
