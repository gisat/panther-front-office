import React from "react";

import './style.scss';
import AreasToolItem from "./components/AreasToolItem";
import DataExportToolItem from "./components/DataExportToolItem";
import AppContext from '../../../../context';

class Tools extends React.PureComponent {

	static contextType = AppContext;

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="esponFuore-header-toolbar-tools">
				<AreasToolItem
					itemKey="areas"
					name="Areas filter"
					icon="filter"
					windowSetKey={this.context.windowSetKey}
				/>
				<DataExportToolItem
					itemKey="export"
					name="Data export"
					icon="file-export"
					windowSetKey={this.context.windowSetKey}
				/>
			</div>
		);
	}
}

export default Tools;
