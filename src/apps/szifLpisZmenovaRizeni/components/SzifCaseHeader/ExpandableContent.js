import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import ExpandRowButton from "../../../../components/common/atoms/ExpandRowButton";

const BASE_HEIGHT = 79.8; //todo max height!

class ExpandableContent extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			expanded: props.initialExpanded || false,
			focus: false,
			contentHeight: 0
		};

		this.contentRef = this.contentRef.bind(this);
		this.onControlClick = this.onControlClick.bind(this);
		this.onFocusInput = this.onFocusInput.bind(this);
		this.onBlurInput = this.onBlurInput.bind(this);
	}

	contentRef(el) {
		this.contentElement = el;
	}

	componentDidMount() {
		this.resize();
	}

	componentDidUpdate() {
		this.resize();
	}

	resize() {
		this.setState({
			contentHeight: this.contentElement.clientHeight
		});
	}

	onControlClick() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	onFocusInput(){
		this.setState({
			focus: true
		});
	}

	onBlurInput(){
		this.setState({
			focus: false
		});
	}

	render() {

		let children = React.Children.map(this.props.children, child => {
			return React.cloneElement(child, {...child.props, onFocusInput: this.onFocusInput, onBlurInput: this.onBlurInput});
		});

		let style = {}, contentStyle = {};

		if (this.state.expanded || this.state.focus) {
			let totalHeight = Math.max(BASE_HEIGHT + (this.state.expanded ? 20 : 0), this.state.contentHeight); // +20 for response to user click
			let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
			let maxHeight = window.innerHeight - 2.2*rem;
			if (totalHeight > maxHeight) {
				style.height = maxHeight;
				contentStyle.height = maxHeight;
				contentStyle.overflowY = 'auto';
			} else {
				style.height = totalHeight;
			}

		}

		return (
			<div
				className={classnames("ptr-dromasLpisChangeReviewHeader-expandable-content", {expanded: this.state.expanded || this.state.focus})}
				style={style}
			>
				<div
					className="ptr-dromasLpisChangeReviewHeader-expandable-content-container"
					style={contentStyle}
				>
					<div ref={this.contentRef}>
						{children}
					</div>
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-expandable-content-control">
					<ExpandRowButton
						circular
						inverted
						expanded={this.state.expanded || this.state.focus}
						onClick={this.onControlClick}
					/>
				</div>
			</div>
		);
	}

}

export default ExpandableContent;
