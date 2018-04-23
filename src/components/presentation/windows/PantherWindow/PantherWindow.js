import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './PantherWindow.css';

const DEFAULT_STATE = {
	height: '100%',
	width: '100%',
	positionX: 0,
	positionY: 0,
	open: false,
	floating: false
};

const DEFAULT_FLOATER_WIDTH = 400;
const DEFAULT_FLOATER_HEIGHT = 500;
const DEFAULT_FLOATER_X = 100;
const DEFAULT_FLOATER_Y = 100;

class PantherWindow extends React.PureComponent {

	static propTypes = {
		height: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		floaterHeight: PropTypes.number,
		minHeight: PropTypes.number,
		width: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		floaterWidth: PropTypes.number,
		minWidth: PropTypes.number,
		positionX: PropTypes.number,
		positionY: PropTypes.number,
		name: PropTypes.string,
		id: PropTypes.string,
		floatable: PropTypes.bool,
		floating: PropTypes.bool,
		open: PropTypes.bool,
		onClose: PropTypes.func
	};

	static defaultProps = {
		floatable: true,
		name: "Window",
		minWidth: 200,
		minHeight: 200,
	};

	constructor(props){
		super();
		this.state = {...DEFAULT_STATE, ...props}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({...this.state, ...nextProps});
	}

	onDragStop(e, d){
		this.props.onDragStop({
			positionX: d.x,
			positionY: d.y,
			floaterPositionX: d.x,
			floaterPositionY: d.y
		});
	}

	onExpand(){
		this.props.onExpand();
	}

	onResize(e, direction, ref, delta, position){
		this.props.onResize({
			floaterWidth: ref.offsetWidth,
			floaterHeight: ref.offsetHeight,
			width: ref.offsetWidth,
			height: ref.offsetHeight,
			positionX: position.x,
			positionY: position.y,
			floaterPositionX: position.x,
			floaterPositionY: position.y
		});
	}

	onShrink(){
		this.props.onShrink({
			width: this.state.floaterWidth || DEFAULT_FLOATER_WIDTH,
			height: this.state.floaterHeight || DEFAULT_FLOATER_HEIGHT,
			positionX: this.state.floaterPositionX || DEFAULT_FLOATER_X,
			positionY: this.state.floaterPositionY || DEFAULT_FLOATER_Y
		});
	}

	render() {
		let classes = classnames('ptr-window',{
			'floating': this.state.floating
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
				id={this.state.id}
				dragHandleClassName=".ptr-window-header"
				size={{ width: this.state.width,  height: this.state.height }}
				position={{ x: this.state.positionX, y: this.state.positionY }}
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
		return <div className="ptr-window-content"></div>
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
