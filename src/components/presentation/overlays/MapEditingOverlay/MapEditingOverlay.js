import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

class MapEditingOverlay extends React.PureComponent {

	static propTypes = {
		onClose: PropTypes.func,
		open: PropTypes.bool
	};

	constructor(props){
		super(props);

		this.onClose = this.onClose.bind(this);
	}

	onClose(){
		this.props.close();
	}

	render() {
		let classes = classNames('ptr-overlay opaque no-padding', {
			'open': this.props.open
		});

		return (
			<div className={classes}>
				<div onClick={this.onClose}>Close</div>
			</div>
		);
	}
}

export default MapEditingOverlay;
