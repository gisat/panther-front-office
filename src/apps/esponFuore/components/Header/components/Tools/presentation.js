import React from "react";

import './style.scss';
import ToolItem from "./components/ToolItem";
import AreasToolItem from "./components/AreasToolItem";
import LayersToolItem from "./components/LayersToolItem";

class Tools extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	// TODO pass windowSetKey from context?
	render() {
		return (
			<div className="esponFuore-header-toolbar-tools">
				<LayersToolItem
					itemKey="layers"
					name="Layers"
					icon="pushpin"
					windowsSetKey="esponFuore"
				/>
				<AreasToolItem
					itemKey="areas"
					name="Areas"
					icon="times"
					windowsSetKey="esponFuore"
				/>
				<ToolItem
					disabled
					itemKey="information"
					name="Information"
					icon="edit"
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
