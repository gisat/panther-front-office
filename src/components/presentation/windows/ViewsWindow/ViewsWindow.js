import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import Window from "../../../containers/Window";
import ScopeIntroSwitch from "../../../containers/controls/ScopeIntroSwitch";

import "./ViewsWindow.css";

class ViewsWindow extends React.PureComponent {

	static propTypes = {
		scopeKey: PropTypes.number
	};

	render() {
		return (
			<Window
				window="views"
				name="Views"
				minWidth={600}
				width={800}
				elementId="views-window"
				expandable={true}
				dockable={true}
			>
				<ScopeIntroSwitch
					scopeKey={this.props.scopeKey}
				/>
			</Window>
		);
	}

}

export default ViewsWindow;
