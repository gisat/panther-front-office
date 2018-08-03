import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import Button from '../../../presentation/atoms/Button';

class ExpandableContent extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			expanded: props.initialExpanded || false
		};

		this.onControlClick = this.onControlClick.bind(this);
	}

	onControlClick() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	render() {
		return (
			<div className={classnames("ptr-dromasLpisChangeReviewHeader-expandable-content", {expanded: this.state.expanded})}>
				<div>
					{this.props.children}
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-expandable-content-control">
					<Button
						invisible
						icon="expand"
						onClick={this.onControlClick}
					/>
				</div>
			</div>
		);
	}

}

export default ExpandableContent;
