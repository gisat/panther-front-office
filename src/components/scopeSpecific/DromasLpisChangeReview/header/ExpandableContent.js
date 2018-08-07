import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import ExpandRowButton from '../../../presentation/atoms/ExpandRowButton';

class ExpandableContent extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			expanded: props.initialExpanded || false,
			focus: false
		};

		this.onControlClick = this.onControlClick.bind(this);
		this.onFocusInput = this.onFocusInput.bind(this);
		this.onBlurInput = this.onBlurInput.bind(this);
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

		return (
			<div
				className={classnames("ptr-dromasLpisChangeReviewHeader-expandable-content", {expanded: this.state.expanded || this.state.focus})}
			>
				<div>
					{children}
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-expandable-content-control">
					<ExpandRowButton
						invisible
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
