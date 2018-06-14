import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import './MapEditingControlPanel.css';

class MapEditingControlPanel extends React.PureComponent {

	static propTypes = {
	};

	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className="ptr-overlay-editing-control-panel"></div>
		);
	}
}

export default MapEditingControlPanel;
