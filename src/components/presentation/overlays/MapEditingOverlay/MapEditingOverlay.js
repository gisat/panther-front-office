import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from '@gisatcz/ptr-utils'
import _ from 'lodash';

import './MapEditingOverlay.css';
import Names from "../../../../constants/Names";

class MapEditingOverlay extends React.PureComponent {

	static propTypes = {
		open: PropTypes.bool
	};

	constructor(props){
		super(props);
	}

	render() {
		let classes = classNames('ptr-overlay ptr-overlay-editing opaque', {
			'open': this.props.open
		});

		return (
			<div className={classes}>
				{this.props.children}
			</div>
		);
	}
}

export default MapEditingOverlay;
