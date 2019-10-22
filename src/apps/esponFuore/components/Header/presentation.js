import React from "react";

import Home from './components/Home';
import User from '../../../../components/common/controls/User';
import IndicatorSelect from './components/IndicatorSelect';
import ScopeSelect from "./components/ScopeSelect";
import Tools from "./components/Tools";

import AppContext from '../../context';

export default class Header extends React.PureComponent {
	static contextType = AppContext;

	render() {
		return (
			<div className="esponFuore-header">
				<div className="esponFuore-header-home"><Home /></div>
				<div className="esponFuore-header-region-select">
					<ScopeSelect/>
				</div>
				<div className="esponFuore-header-indicator-select">
					<IndicatorSelect 
						windowSetKey = {this.context.windowSetKey}
						categoryTagKey={this.props.categoryTagKey}
					/>
				</div>
				<div className="esponFuore-header-toolbar">
					<Tools/>
					<div className="esponFuore-header-toolbar-right"><User inverted/></div>
				</div>
			</div>
			)
	}
};