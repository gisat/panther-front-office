import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class DataUploadOverlay extends React.PureComponent {

	static propTypes = {
		open: PropTypes.bool
	};

	render() {
		let classes = classnames("ptr-overlay", {
			"open": this.props.open
		});

		return (
			<div className={classes}>
			</div>
		);
	}

}

export default DataUploadOverlay;
