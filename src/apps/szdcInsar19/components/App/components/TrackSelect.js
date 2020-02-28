import {connect} from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import React from "react";

const mapStateToProps = (state, ownProps) => {
	return {
		areaTrees: Select.areas.areaTrees.getByKeysAsObject(state, ownProps.areaTreeKeys)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		selectTracks: keys => {
			dispatch(Action.components.set('szdcInsar19_App', 'activeTracks', keys));
			dispatch(Action.specific.szdcInsar19.changeAppView());
		},
		onMount: () => {
			dispatch(Action.areas.areaTrees.useKeys(ownProps.areaTreeKeys, 'szdcInsar19_TrackSelect'));
		},
		onUnmount: () => {
			dispatch(Action.areas.areaTrees.useKeysClear('szdcInsar19_TrackSelect'));
		}
	}
};

let selectTrack = (activeTracks, key) => {
	return _.includes(activeTracks, key) ? _.without(activeTracks, key) : _.concat(activeTracks, key);
};

class TrackSelect extends React.PureComponent {

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {

		let props = this.props;

		if (props.activeTracks && props.areaTreeKeys) {

			return (
				<div className="szdcInsar19-TrackSelect">
					{_.map(props.areaTreeKeys, uuid => (
						<label key={uuid}>
							<input
								key={uuid}
								type="checkbox"
								name="track"
								value={uuid}
								onClick={props.selectTracks.bind(null, selectTrack(props.activeTracks, uuid))}
								checked={_.includes(props.activeTracks, uuid)}
								readOnly
							/>
							{props.areaTrees && props.areaTrees[uuid].data.nameInternal || 'Track'}
						</label>
					))}
				</div>
			);

		}

		return null;

	};

}

export default connect(mapStateToProps, mapDispatchToProps)(TrackSelect);