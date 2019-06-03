import React from 'react';
import PropTypes from 'prop-types';

import Window from "../../../containers/Window";
import './SnapshotsWindow.css';
import Button from "../../../common/atoms/Button";
import SnapshotCard from "../../../containers/controls/SnapshotCard";

let polyglot = window.polyglot;

class SnapshotsWindow extends React.PureComponent {

	static propTypes = {
		createMapSnapshot: PropTypes.func,
		snapshots: PropTypes.array
	};

	render() {
		return (
			<Window
				window="snapshots"
				name={polyglot.t('snapshots')}
				minWidth={300}
				width={850}
				elementId="snapshots-window"
				expandable={true}
				dockable={true}
				dockedWidth={300}
			>
				<Button
					onClick={this.props.createMapSnapshot}
					icon="plus"
				>
					{polyglot.t('createMapSnapshot')}
				</Button>
				<div className="ptr-snapshots-container">
					{this.renderSnapshots()}
				</div>
			</Window>
		);
	}

	renderSnapshots(){
		return this.props.snapshots ? this.props.snapshots.map((snapshot) => {
			return (
				<SnapshotCard
					key={snapshot.key}
					snapshotKey={snapshot.key}
					name={snapshot.data.name}
					type={snapshot.data.type}
					source={snapshot.data.source}
				/>
			);
		}) : null;
	}

}

export default SnapshotsWindow;
