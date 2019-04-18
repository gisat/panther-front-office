import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Rnd } from 'react-rnd';
import _ from 'lodash';

import Icon from "../../atoms/Icon";

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MAX_WIDTH = "auto";
const MAX_HEIGHT = "auto";

class Window extends React.PureComponent {

	static propTypes = {
		content: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.array
		]),
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

		this.onClick = this.onClick.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onResize = this.onResize.bind(this);
	}

	// todo onDrag

	onClick() {
		if (this.props.onClick) {
			this.props.onClick(this.props.windowKey)
		}
	}

	onClose(e) {
		e.stopPropagation();
		if (this.props.onCloseClick) {
			this.props.onCloseClick(this.props.windowKey)
		}
	}

	onResize(e, direction, ref, delta, position) {
		if (this.props.onResize) {
			this.props.onResize(this.props.windowKey, ref.offsetWidth, ref.offsetHeight); // TODO check
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

		return (
			<Rnd
				bounds="parent"
				className={classes}
				dragHandleClassName={handleClass}
				minWidth={props.minWidth ? props.minWidth : MIN_WIDTH}
				minHeight={props.minHeight ? props.minHeight : MIN_HEIGHT}
				maxWidth={props.maxWidth ? props.maxWidth : MAX_WIDTH}
				maxHeight={props.maxHeight ? props.maxHeight : MAX_HEIGHT}
				onClick={this.onClick}
				onResize={this.onResize}
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
				<div className="ptr-window-control" onClick={this.onClose}>
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
}

export default Window;
