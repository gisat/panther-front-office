import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Window from "../../../containers/Window";

class ViewsWindow extends React.PureComponent {
	render() {
		return (
			<Window
				window="views"
				name="Views"
				elementId="views-window"
				expandable={true}
				dockable={true}
			>
			</Window>
		);
	}

}

export default ViewsWindow;
