import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import MapEditingControlPanel from '../../../containers/controls/mapEditing/MapEditingControlPanel';
import MapEditingMapContainer from '../../../containers/controls/mapEditing/MapEditingMapContainer';

import './MapEditingOverlay.css';

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
		let classes = classNames('ptr-overlay ptr-overlay-editing opaque', {
			'open': this.props.open
		});

		return (
			<div className={classes}>
				<MapEditingControlPanel/>
				<MapEditingMapContainer/>
				<div onClick={this.onClose} className="ptr-overlay-close close-map-editing">{'\u2716'}</div>
			</div>
		);
	}
}

export default MapEditingOverlay;
