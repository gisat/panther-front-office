import {rangeMap} from "../../../../../../utils/statistics";
import {getRadius} from "../../../../../../components/common/maps/Deprecated_WorldWindMap/layers/utils/diagram";
import {
	MAX_DIAGRAM_RADIUS,
	MIN_DIAGRAM_RADIUS
} from "../../../../../../components/common/maps/Deprecated_WorldWindMap/styles/cartodiagram";

function prepareDiagramLegendData(min, max, currentRange, color) {
	let mapComponents = document.getElementsByClassName("ptr-world-wind-map");
	if (mapComponents) {
		const diagramType = 'volume';
		let mapComponent = document.getElementById(mapComponents[0].id);
		let mapWidthPx = mapComponent.clientWidth;
		let mapFunction = rangeMap([getRadius(min, diagramType), getRadius(max, diagramType)], [MIN_DIAGRAM_RADIUS, MAX_DIAGRAM_RADIUS]);

		return getNiceValues(min, max).map(value => {
			return {
				color,
				value,
				radius: getRadius(value, diagramType, mapFunction)*(mapWidthPx/currentRange)
			};
		});
	}
}


function getNiceValues (min, max) {
	const roundedMin = Math.floor(min);
	const roundedMax = Math.ceil(max);

	const minDigits = roundedMin.toString().length;
	const maxDigits = roundedMax.toString().length;
	const digitsDiff = Math.abs(maxDigits - minDigits);

	if (digitsDiff === 0) {
		return [roundedMax,roundedMin]
	} else if (digitsDiff === 1) {
		return [roundedMax, Math.round(roundedMax/2),  roundedMin]
	} else {
		let centerDigits = Math.round((max/10)).toString().length;
		let center = Math.pow(10, centerDigits);

		if (roundedMax/center < 5) {
			center /= 2;
		}

		return [roundedMax, center, roundedMin];
	}
}

export default {
	prepareDiagramLegendData
}

