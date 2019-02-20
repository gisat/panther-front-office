import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import Icon from '../../common/atoms/Icon';

import './Window.css';

let polyglot = window.polyglot;

const DEFAULT_FLOATER_WIDTH = 500;
const DEFAULT_FLOATER_HEIGHT = 600;
const DEFAULT_FLOATER_X = 100;
const DEFAULT_FLOATER_Y = 100;

const DEFAULT_STATE = {
	height: DEFAULT_FLOATER_HEIGHT,
	width: DEFAULT_FLOATER_WIDTH,
	positionX: DEFAULT_FLOATER_X,
	positionY: DEFAULT_FLOATER_Y,
	open: false,
	floating: false
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

		dockable: PropTypes.bool,
		docked: PropTypes.bool,
		dockedWidth: PropTypes.number,
		expandable: PropTypes.bool,
		expanded: PropTypes.bool,
		floatable: PropTypes.bool,
		floating: PropTypes.bool,
		open: PropTypes.bool,

		onClose: PropTypes.func,

		onDock: PropTypes.func,
		onFloat: PropTypes.func,
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
		this.state = {...DEFAULT_STATE, ..._.pick(props, ['width', 'minWidth', 'height', 'open', 'docked', 'expanded', 'floating', 'positionX', 'positionY'])};
	}

	componentWillReceiveProps(nextProps) {
		let nextState = {...this.state, ..._.pick(nextProps, ['width', 'minWidth', 'height', 'open', 'docked', 'expanded', 'floating', 'positionX', 'positionY'])};

		if (!nextProps.docked && !nextProps.expanded && nextProps.floatable){
			nextState.floating = true;
		}

		this.setState(nextState);
	}

	onDock(){
		this.props.onDock();
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

	onFloat(){
		this.props.onFloat();
	}

	render() {
		let classes = classnames(`ptr-window ${this.props.elementId}`,{
			'docked': this.state.docked,
			'expanded': this.state.expanded,
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
			style.display = 'flex';
		}
		if (this.state.docked){
			style.position = 'relative';
		}

		let header = this.renderHeader();
		let content = this.renderContent();

		let size = this.state.docked ? {width: (this.props.dockedWidth ? `${this.props.dockedWidth}px` : '300px'), height: '100%'} :
			(this.state.expanded ? {width: '100%', height: '100%'} : { width: this.state.width,  height: this.state.height });
		let position = (this.state.docked || this.state.expanded) ? {x: 0, y: 0} : { x: this.state.positionX, y: this.state.positionY };

		return (
			<Rnd
				style={style}
				className={classes}
				dragHandleClassName=".ptr-window-header"
				size={size}
				position={position}
				bounds="body"
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
		let dockingSwitch = null;
		let expandedSwitch = null;
		let floatingSwitch = null;

		if (this.props.expandable && !this.state.expanded){
			expandedSwitch = (<div
				className="ptr-window-tool window-expand"
				title={polyglot.t('maximise')}
				onClick={this.onExpand.bind(this)}
			><Icon icon="expand"/></div>);
		}
		if (this.props.floatable && !this.state.floating){
			floatingSwitch = (<div
				className="ptr-window-tool window-shrink"
				title={polyglot.t('float')}
				onClick={this.onFloat.bind(this)}
			><Icon icon="restore"/></div>);
		}
		if (this.props.dockable && !this.state.docked){
			dockingSwitch = (<div
				className="ptr-window-tool window-dock"
				title={polyglot.t('dock')}
				onClick={this.onDock.bind(this)}
			><Icon icon="pushpin"/></div>);
		}

		return (
			<div className="ptr-window-header">
				<div className="ptr-window-title">
					{this.props.name}
				</div>
				<div className="ptr-window-tools">
					{dockingSwitch}
					{floatingSwitch}
					{expandedSwitch}
					<div
						className="ptr-window-tool window-close"
						title={polyglot.t('close')}
						onClick={this.props.onClose}
					>{'\u2716'}</div>
				</div>
			</div>);
	}

}

export default PantherWindow;
