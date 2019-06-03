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
				<AreasToolItem
					itemKey="areas"
					name="Areas filter"
					icon="filter"
					windowSetKey={this.context.windowSetKey}
				/>
				{/*<LayersToolItem*/}
					{/*itemKey="layers"*/}
					{/*name="Layers"*/}
					{/*icon="layers"*/}
					{/*windowSetKey={this.context.windowSetKey}*/}
				{/*/>*/}
				{/*<InformationToolItem*/}
					{/*disabled*/}
					{/*itemKey="information"*/}
					{/*name="Information"*/}
					{/*icon="info"*/}
					{/*windowSetKey={this.context.windowSetKey}*/}
				{/*/>*/}
				{/*<ToolItem*/}
					{/*disabled*/}
					{/*itemKey="share"*/}
					{/*name="Share"*/}
					{/*icon="share"*/}
				{/*/>*/}
			</div>
		);
	}
}

export default Tools;
