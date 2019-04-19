import React from "react";

import './style.scss';
import ToolItem from "./components/ToolItem";
import AreasToolItem from "./components/AreasToolItem";
import LayersToolItem from "./components/LayersToolItem";
import InformationToolItem from "./components/InformationToolItem";
import AppContext from '../../../../context';

class Tools extends React.PureComponent {

	static contextType = AppContext;

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="esponFuore-header-toolbar-tools">
				<LayersToolItem
					itemKey="layers"
					name="Layers"
					icon="pushpin"
					windowSetKey={this.context.windowSetKey}
				/>
				<AreasToolItem
					itemKey="areas"
					name="Areas"
					icon="times"
					windowSetKey={this.context.windowSetKey}
				/>
				<InformationToolItem
					itemKey="information"
					name="Information"
					icon="edit"
					windowSetKey={this.context.windowSetKey}
				/>
				<ToolItem
					disabled
					itemKey="share"
					name="Share"
					icon="chevron-left"
				/>
			</div>
		);
	}
}

export default Tools;
