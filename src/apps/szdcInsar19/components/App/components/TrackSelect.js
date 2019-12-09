import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import React from "react";

const mapStateToProps = (state, ownProps) => {
	return {
		areaTrees: Select.areas.areaTrees.getByKeys(state, ownProps.areaTreeKeys)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		selectTracks: keys => {
			dispatch(Action.components.set('szdcInsar19_App', 'activeTracks', keys));
			dispatch(Action.specific.szdcInsar19.changeAppView());
		},
	}
};

let selectTrack = (activeTracks, key) => {
	return _.includes(activeTracks, key) ? _.without(activeTracks, key) : _.concat(activeTracks, key);
};

let TrackSelect = props => {

	if (props.activeTracks && props.areaTreeKeys) {

		return (
			<div>
				{_.map(props.areaTreeKeys, uuid => (
					<label>
						<input
							key={uuid}
							type="checkbox"
							name="track"
							value={uuid}
							onClick={props.selectTracks.bind(null, selectTrack(props.activeTracks, uuid))}
							checked={_.includes(props.activeTracks, uuid)}
						/>
						{uuid}
					</label>
				))}
			</div>
		);

	}

	return null;

};

export default connect(mapStateToProps, mapDispatchToProps)(TrackSelect);