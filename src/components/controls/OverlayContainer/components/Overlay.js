import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Overlay extends React.PureComponent {

	static propTypes = {
		scope: PropTypes.object
	};

	constructor(props) {
		super();
	}

	render() {
		let classes = classNames(
			'ptr-overlay', {
				'open': !this.props.activeAoi
			}
		);
		return (
			<div className={classes}>
			</div>
		);
	}
}

export default Overlay;
