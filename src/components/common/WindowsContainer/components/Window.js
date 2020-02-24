import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Rnd } from 'react-rnd';
import _ from 'lodash';

import {Icon} from '@gisatcz/ptr-atoms'

// TODO handle sizes in rem
const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MAX_WIDTH = "auto";
const MAX_HEIGHT = "auto";

class Window extends React.PureComponent {

	static propTypes = {
		containerHeight: PropTypes.number,
		containerWidth: PropTypes.number,
		content: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.array
		]),
		icon: PropTypes.string,
		onDragStart: PropTypes.func,
		onDragStop: PropTypes.func,
		onClick: PropTypes.func,
		onCloseClick: PropTypes.func,
		onResize: PropTypes.func,
		title: PropTypes.string,
		windowKey: PropTypes.string,
		withoutHeader: PropTypes.bool,
		zIndex: PropTypes.number
	};

	constructor(props){
		super(props);

		this.onDragStart = this.onDragStart.bind(this);
		this.onDragStop = this.onDragStop.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onResize = this.onResize.bind(this);
	}

	onClick() {
		if (this.props.onClick) {
			this.props.onClick(this.props.windowKey);
		}
	}

	onClose(e) {
		e.stopPropagation();
		if (this.props.onCloseClick) {
			this.props.onCloseClick(this.props.windowKey);
		}
	}

	onDragStart() {
		if (this.props.onDragStart) {
			this.props.onDragStart(this.props.windowKey);
		}
	}

	onDragStop(e, data) {
		let position = this.calculatePositionFromXY(data.x, data.y, this.props.width, this.props.height);

		// TODO find better way
		let isTargetCloseButton = e.target.className && e.target.className === "ptr-window-control close";
		let isParentCloseButton = _.find(e.path, (element) => {return element.className === "ptr-window-control close"});

		if (isTargetCloseButton || isParentCloseButton) {
			this.onClose(e);
		}

		else if (this.props.onDragStop) {
			this.props.onDragStop(this.props.windowKey, position);
		}
	}

	onResize(e, direction, ref, delta, coord) {
		if (this.props.onResize) {
			let position = this.calculatePositionFromXY(coord.x, coord.y, ref.offsetWidth, ref.offsetHeight);
			// console.log(position, ref.offsetWidth, ref.offsetHeight , direction, delta);
			this.props.onResize(this.props.windowKey, ref.offsetWidth, ref.offsetHeight, position); // TODO check
		}
	}

	render() {
		const props = this.props;
		const handleClass = "ptr-window-handle";

		let classes = classNames("ptr-window", {
			[handleClass]: !!this.props.withoutHeader
		});

		let width = this.props.width ? this.props.width : 'auto';
		let height = this.props.height ? this.props.height : 'auto';

		if (width > this.props.containerWidth && this.props.containerWidth) {
			width = this.props.containerWidth;
		}

		if (height > this.props.containerHeight && this.props.containerHeight) {
			height = this.props.containerHeight;
		}

		let position = this.calculateXYfromPosition(width, height);

		return (
			<Rnd
				bounds="parent"
				className={classes}
				dragHandleClassName={handleClass}
				minWidth={props.minWidth ? props.minWidth : MIN_WIDTH}
				minHeight={props.minHeight ? props.minHeight : MIN_HEIGHT}
				maxWidth={props.maxWidth ? props.maxWidth : MAX_WIDTH}
				maxHeight={props.maxHeight ? props.maxHeight : MAX_HEIGHT}
				onDragStop={this.onDragStop}
				onDragStart={this.onDragStart}
				onClick={this.onClick}
				onResize={this.onResize}
				position={{
					x: position.x,
					y: position.y
				}}
				size={{width, height}}
			>
				{this.props.withoutHeader ? this.renderControls(true) : this.renderHeader(handleClass)}
				{this.renderContent()}
			</Rnd>
		);
	}

	renderHeader(handleClass) {
		let headerClasses = "ptr-window-header " + handleClass;

		return (
			<div className={headerClasses}>
				<div className="ptr-window-title" title={this.props.title}>
					{this.props.icon ? <Icon icon={this.props.icon}/> : null}
					{this.props.title}
				</div>
				{this.renderControls()}
			</div>
		);
	}

	renderControls(fixed) {
		let classes = classNames("ptr-window-controls", {
			fixed: fixed
		});

		return (
			<div className={classes}>
				<div className="ptr-window-control close" onClick={this.onClose}>
					<Icon icon="close"/>
				</div>
			</div>
		);
	}

	renderContent() {
		return (
			<div className="ptr-window-content">
				{this.props.content}
			</div>
		);
	}

	calculateXYfromPosition(width, height) {
		const containerWidth = this.props.containerWidth;
		const containerHeight = this.props.containerHeight;

		const top = this.props.position.top;
		const bottom = this.props.position.bottom;
		const left = this.props.position.left;
		const right = this.props.position.right;

		let x = 0;
		let y = 0;

		if (top || top === 0) {
			if ((top + height) < containerHeight) {
				y = top;
			} else {
				y = containerHeight - height;
			}
		} else {
			if ((bottom + height) < containerHeight) {
				y = containerHeight - (bottom + height);
			} else {
				y = 0;
			}
		}

		if (left || left === 0) {
			if ((left + width) < containerWidth) {
				x = left;
			} else {
				x = containerWidth - width;
			}
		} else {
			if ((right + width) < containerWidth) {
				x = containerWidth - (right + width);
			} else {
				x = 0;
			}
		}

		return {x, y};
	}

	calculatePositionFromXY(x, y, width, height) {
		const containerWidth = this.props.containerWidth;
		const containerHeight = this.props.containerHeight;

		let topDiff = y;
		let bottomDiff = containerHeight - (y + height);
		let leftDiff = x;
		let rightDiff = containerWidth - (x + width);

		let position = {top: null, bottom: null, left: null, right: null};

		if (topDiff > bottomDiff && bottomDiff > 0) {
			position.bottom = bottomDiff;
		} else {
			position.top = topDiff;
		}

		if (leftDiff > rightDiff && rightDiff > 0) {
			position.right = rightDiff;
		} else {
			position.left = leftDiff;
		}

		return position;
	}
}

export default Window;
