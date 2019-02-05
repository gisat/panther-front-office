import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import './style.css';

class Screens extends React.PureComponent {

	static propTypes = {
	};

	render() {
		return (
			<div className="ptr-screens">
				{this.props.children}
			</div>
		);
	}
}

export default Screens;
