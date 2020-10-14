import './style.scss';
import espon_logo from '../../../../assets/img/espon-logo-full.png';

export default (d) => {
	return `
<div class="download-page-header">
    <span class="scope">${d.scope}</span>
    <h1 class="title">${d.attribute} (${d.period})</h1>
</div>
<div class="download-page-map-container">
    <img id="${d.mapComponentId}" class="map" alt="map" src="${d.mapCanvasData}"/>
    <div id="esponFuore-map-scale">
        <div class="scale-wrapper">
            <div id="${d.scaleLineId}"></div>
            <div id="${d.scaleLabelId}"></div>
        </div>
    </div>
    <img class="espon-logo" alt="espon" src="${espon_logo}"/>
</div>

<div class="download-page-footer">
    <div class="download-page-copyrights">
        <div class="download-page-espon-copyright">© ESPON ${new Date().getFullYear()}</div>
        <div>Background map: © OpenStreetMap contributors (https://www.openstreetmap.org/copyright)</div>
        <div>Administrative boundaries: University of Geneva, licensed under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)</div>
    </div>
    <div class="download-page-legend-container">
        <h5>Map legend</h5>
        <div id="${d.legendComponentId}"></div>
    </div>
</div>
	`;
}