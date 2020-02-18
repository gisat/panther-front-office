import React from 'react';
import PropTypes from 'prop-types';
import {utils} from '@gisatcz/ptr-utils'
import _ from 'lodash';

import Window from "../../../containers/Window";
import ScopeIntroSwitch from "../../../containers/ScopeIntroSwitch";

import "./ViewsWindow.css";

let polyglot = window.polyglot;

class ViewsWindow extends React.PureComponent {

	static propTypes = {
		scopeKey: PropTypes.number
	};

	render() {
		return (
			<Window
				window="views"
				name={polyglot.t('views')}
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
