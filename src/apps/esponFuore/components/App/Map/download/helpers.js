import download from "downloadjs";
import domToImage from "dom-to-image";
import template from "./template";

function downloadAsPng(wwd, canvasId) {
	// TODO to pdf
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

		container.appendChild(node);
		node.innerHTML = template({
			period: props.label,
			attribute: props.activeAttribute && props.activeAttribute.data && props.activeAttribute.data.nameDisplay,
			scope: props.activeScope && props.activeScope.data && props.activeScope.data.nameDisplay,
			mapCanvasData
		});

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

function resetElements(container, node) {
	node.remove();
	container.style.overflow = "auto";
}

export default {
	downloadAsPng
}