import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Rnd } from 'react-rnd';
import _ from 'lodash';

import Icon from "../../atoms/Icon";

class Window extends React.PureComponent {

	static propTypes = {
		content: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.array
		]),
		onCloseClick: PropTypes.func,
		title: PropTypes.string,
		windowKey: PropTypes.string,
		withoutHeader: PropTypes.bool,
		zIndex: PropTypes.number
	};

	constructor(props){
		super(props);

		this.onClose = this.onClose.bind(this);
	}

	onClose() {
		if (this.props.onCloseClick) {
			this.props.onCloseClick(this.props.windowKey)
		}
	}

	render() {
		const handleClass = "ptr-window-handle";

		let classes = classNames("ptr-window", {
			[handleClass]: !!this.props.withoutHeader
		});

		// TODO max/min sizes just for testing
		return (
			<Rnd
				bounds="parent"
				className={classes}
				dragHandleClassName={handleClass}
				minWidth={100}
				minHeight={100}

				maxWidth={500}
				maxHeight={300}
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
