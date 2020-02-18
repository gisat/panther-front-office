import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from '@gisatcz/ptr-utils'
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
			<div className="ptr-editing-control-panel">
				<h2 className="ptr-editing-control-panel-title">
					{this.props.title}
				</h2>
				{this.props.children}
			</div>
		);
	}
}

export default MapEditingControlPanel;
