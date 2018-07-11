import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import Window from "../../../containers/Window";
import ViewsList from "../../../containers/controls/ViewsList";

import "./ViewsWindow.css";

class ViewsWindow extends React.PureComponent {

	static propTypes = {
		selectedScope: PropTypes.object
	};

	render() {
		return (
			<Window
				window="views"
				name="Views"
				elementId="views-window"
				expandable={true}
				dockable={true}
			>
				<ViewsList
						selectedScope={this.props.selectedScope}
				/>
			</Window>
		);
	}

}

export default ViewsWindow;
