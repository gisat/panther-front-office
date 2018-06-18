import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import './MapEditingOverlay.css';
import Names from "../../../../constants/Names";

class MapEditingOverlay extends React.PureComponent {

	static propTypes = {
		close: PropTypes.func,
		closeConfirmMessage: PropTypes.string,
		onClose: PropTypes.func,
		open: PropTypes.bool
	};

	constructor(props){
		super(props);
		this.onClose = this.onClose.bind(this);
	}

	onClose(){
		if (this.props.closeConfirmMessage){
			if (window.confirm(this.props.closeConfirmMessage)) {
				this.props.onClose();
				this.props.close();
			}
		} else {
			this.props.onClose();
			this.props.close();
		}
	}

	render() {
		let classes = classNames('ptr-overlay ptr-overlay-editing opaque', {
			'open': this.props.open
		});

		return (
			<div className={classes}>
				{this.props.children}
				<div onClick={this.onClose} className="ptr-overlay-close close-map-editing">{'\u2716'}</div>
			</div>
		);
	}
}

export default MapEditingOverlay;
