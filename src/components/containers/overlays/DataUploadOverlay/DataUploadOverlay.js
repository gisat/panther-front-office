import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class DataUploadOverlay extends React.PureComponent {

	static propTypes = {
		open: PropTypes.bool
	};

	close() {
		this.props.closeOverlay();
	}

	render() {
		let classes = classnames("ptr-overlay", {
			"open": this.props.open
		});

		return (
			<div className={classes}>
				<div className="ptr-overlay-header">
					<h2 className="ptr-overlay-title">Data upload</h2>
					<div onClick={this.close.bind(this)} className="ptr-overlay-close">Close</div>
				</div>
				<div className="ptr-overlay-content"></div>
			</div>
		);
	}

}

export default DataUploadOverlay;
