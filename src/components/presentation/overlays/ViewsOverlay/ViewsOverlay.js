import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import Names from "../../../../constants/Names";
import './ViewsOverlay.css';

class ViewsOverlay extends React.PureComponent {

	static propTypes = {
		open: PropTypes.bool
	};

	constructor(props){
		super(props);
	}

	render() {
		let classes = classNames('ptr-overlay ptr-overlay-views opaque', {
			'open': this.props.open
		});

		return (
			<div className={classes}>
				AAA
			</div>
		);
	}
}

export default ViewsOverlay;
