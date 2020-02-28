import React from "react";
import ReactDom from "react-dom";
import download from "downloadjs";
import domToImage from "dom-to-image";
import {Provider} from '@gisatcz/ptr-state';

import Store from "../../../../state/Store";
import template from "./template";
import MapLegend from "../MapLegend";

function downloadAsPng(wwd, canvasId) {
	let container = document.getElementById("ptr-app");
	let node = document.createElement("div");
	const legendComponentId = 'esponFuore-map-legend';

	prepareDocument(this.props, wwd, canvasId, container, node, legendComponentId).then(() => {
		domToImage.toPng(node).then((dataUrl) => {
			download(dataUrl, `map_${this.props.label}.png`);
			resetElements(container, node, legendComponentId);
		});
	}).catch(err => {
		resetElements(container, node, legendComponentId);
		alert("Export failed!")
	});
}


function prepareDocument(props, wwd, canvasId, container, node, legendComponentId) {
	return getMapCanvasData(wwd, canvasId).then(mapCanvasData => {
		container.style.overflow = "hidden";
		node.id = "esponFuore-map-download";
		const mapComponentId = 'esponFuore-map-snapshot';
		const scaleLineId = 'esponFuore-map-scale-line';
		const scaleLabelId = 'esponFuore-map-scale-label';

		container.appendChild(node);
		node.innerHTML = template({
			period: props.label,
			attribute: props.activeAttribute && props.activeAttribute.data && props.activeAttribute.data.nameDisplay,
			description: props.activeAttribute && props.activeAttribute.data && props.activeAttribute.data.description,
			scope: props.activeScope && props.activeScope.data && props.activeScope.data.nameDisplay,
			mapCanvasData,
			mapComponentId,
			legendComponentId,
			scaleLabelId,
			scaleLineId
		});

		return updateScaleAndAddLegend(props, mapComponentId, legendComponentId, scaleLabelId, scaleLineId, node);
	}).catch(err => {
		resetElements(container, node, legendComponentId);
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

function updateScaleAndAddLegend(props, mapComponentId, legendComponentId, labelComponentId, lineComponentId, node) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {

			// handle scale
			let mapComponent = document.getElementById(mapComponentId);
			let label = document.getElementById(labelComponentId);
			let line = document.getElementById(lineComponentId);

			let oneKmInPx = mapComponent.clientWidth/props.navigator.range*1000;
			let scaleData = calculateScaleData(oneKmInPx, 1);

			label.innerText = scaleData.label;
			line.style.width = scaleData.width + "px";

			// handle legend
			ReactDom.render(
				<Provider store={Store}>
					<MapLegend mapSetKey={props.activeMapSetKey} showNoData={true} mapComponentId={mapComponentId}/>
				</Provider>, document.getElementById(legendComponentId)
			);

			resolve(node);
		}, 50);
	});
}

function calculateScaleData(width, coeff) {
	const maxScaleWidth = 200;
	const minScaleWidth = 100;
	if (width < minScaleWidth) {
		return calculateScaleData(width*10, coeff*10);
	} else if (width > maxScaleWidth){
		return calculateScaleData(width/2, coeff/2);
	} else {
		return {width, label: coeff + " km"}
	}
}


function resetElements(container, node, legendComponentId) {
	ReactDom.unmountComponentAtNode(document.getElementById(legendComponentId));
	setTimeout(() => {
		node.remove();
		container.style.overflow = "auto";
	}, 50);
}

export default {
	downloadAsPng
}