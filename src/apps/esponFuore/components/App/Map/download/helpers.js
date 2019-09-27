import React from "react";
import ReactDom from "react-dom";
import download from "downloadjs";
import domToImage from "dom-to-image";
import { Provider } from 'react-redux';

import Store from "../../../../state/Store";
import template from "./template";
import MapLegend from "../../../../../../components/common/maps/MapLegend";

function downloadAsPng(wwd, canvasId) {
	let container = document.getElementById("ptr-app");
	let node = document.createElement("div");

	prepareDocument(this.props, wwd, canvasId, container, node).then(() => {
		domToImage.toPng(node).then((dataUrl) => {
			download(dataUrl, `map_${this.props.label}.png`);
			resetElements(container, node);
		});
	}).catch(err => {
		resetElements(container, node);
		alert("Export failed!")
	});
}


function prepareDocument(props, wwd, canvasId, container, node) {
	return getMapCanvasData(wwd, canvasId).then(mapCanvasData => {
		container.style.overflow = "hidden";
		node.id = "esponFuore-map-download";
		const legendComponentId = 'esponFuore-map-legend';

		container.appendChild(node);
		node.innerHTML = template({
			period: props.label,
			attribute: props.activeAttribute && props.activeAttribute.data && props.activeAttribute.data.nameDisplay,
			description: props.activeAttribute && props.activeAttribute.data && props.activeAttribute.data.description,
			scope: props.activeScope && props.activeScope.data && props.activeScope.data.nameDisplay,
			mapCanvasData,
			legendComponentId
		});

		addLegend(props, legendComponentId);

		return node;
	}).catch(err => {
		resetElements(container, node);
		alert("Export failed!")
	});
}


function getMapCanvasData(wwd, canvasId) {
	return new Promise((resolve) => {
		const snapshot = (worldWindow, stage) => {
			if(stage === 'afterRedraw') {
				wwd.redrawCallbacks.shift();
				resolve(document.getElementById(canvasId).toDataURL());
			}
		};

		// Get the snapshot from the current map.
		wwd.redrawCallbacks.push(snapshot);
		wwd.redraw();
	});
}

function addLegend(props, componentId) {
	ReactDom.render(
		<Provider store={Store}>
			<MapLegend mapSetKey={props.activeMapSetKey} showNoData={true}/>
		</Provider>, document.getElementById(componentId)
	);
}

function resetElements(container, node) {
	node.remove();
	container.style.overflow = "auto";
}

export default {
	downloadAsPng
}