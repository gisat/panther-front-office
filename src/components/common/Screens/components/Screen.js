import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

class Screen extends React.PureComponent {

	static propTypes = {
		content: PropTypes.oneOfType(
			PropTypes.node,
			PropTypes.array
		),
		onFocus: PropTypes.func,
		onCloseClick: PropTypes.func,
		onRetractClick: PropTypes.func
	};

	render() {
		return (
			<div className="ptr-screen">
				<div className="ptr-screen-scroll">
					{this.props.content}
				</div>
				<div className="ptr-screen-controls top" onClick={this.props.onCloseClick}>Close</div>
				<div className="ptr-screen-controls middle" onClick={this.props.onRetractClick}>Retract</div>
			</div>
		);
	}
}

export default Screen;
