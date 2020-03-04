import React from "react";
import {connects} from '@gisatcz/ptr-state';
import {User} from '@gisatcz/ptr-components';

import Home from './components/Home';
import IndicatorSelect from './components/IndicatorSelect';
import ScopeSelect from "./components/ScopeSelect";
import Tools from "./components/Tools";

import AppContext from '../../context';

const ConnectedUser = connects.User(User);

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
						subCategoryTagKey={this.props.subCategoryTagKey}
					/>
				</div>
				<div className="esponFuore-header-toolbar">
					<Tools/>
					<div className="esponFuore-header-toolbar-right"><ConnectedUser inverted/></div>
				</div>
			</div>
			)
	}
};