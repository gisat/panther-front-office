import download from "downloadjs";
import domToImage from "dom-to-image";
import template from "./template";

function downloadAsPng(wwd, canvasId) {
	getMapCanvasData(wwd, canvasId).then(mapCanvasData => {
		// TODO loader
		// TODO hide parent overflow

		let node = document.createElement("div");
		node.id = "esponFuore-map-download";

		document.getElementById("ptr-app").appendChild(node);
		node.innerHTML = template({
			period: this.props.label,
			mapCanvasData
		});


		domToImage.toPng(node).then((dataUrl) => {
			download(dataUrl, `map_${this.props.label}.png`);
			node.remove();
		});
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

export default {
	downloadAsPng
}