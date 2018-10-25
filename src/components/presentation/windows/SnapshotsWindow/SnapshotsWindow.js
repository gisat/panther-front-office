import React from 'react';
import PropTypes from 'prop-types';

import Window from "../../../containers/Window";

class SnapshotsWindow extends React.PureComponent {

	static propTypes = {
	};

	render() {
		return (
			<Window
				window="snapshots"
				name="Snapshots"
				minWidth={200}
				width={800}
				elementId="snapshots-window"
				expandable={true}
				dockable={true}
				dockedWidth={200}
			>
				Snapshots
			</Window>
		);
	}

}

export default SnapshotsWindow;
