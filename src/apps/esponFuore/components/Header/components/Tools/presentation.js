import React from "react";

import './style.scss';
import ToolItem from "./components/ToolItem";

class Tools extends React.PureComponent {

	constructor(props) {
		super(props);

		this.onToolClick = this.onToolClick.bind(this);
	}

	onToolClick(toolKey) {
		console.log("**** Tool: " + toolKey);
	}

	render() {
		return (
			<div className="esponFuore-header-toolbar-tools">
				<ToolItem
					itemKey="layers"
					name="Layers"
					icon="pushpin"
					onClick={this.onToolClick}
				/>
				<ToolItem
					disabled
					itemKey="areas"
					name="Areas"
					icon="times"
					onClick={this.onToolClick}
				/>
				<ToolItem
					disabled
					itemKey="information"
					name="Information"
					icon="edit"
					onClick={this.onToolClick}
				/>
				<ToolItem
					disabled
					itemKey="share"
					name="Share"
					icon="chevron-left"
					onClick={this.onToolClick}
				/>
			</div>
		);
	}
}

export default Tools;
