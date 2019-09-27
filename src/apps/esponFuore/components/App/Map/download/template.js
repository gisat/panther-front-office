import './style.scss';
import espon_logo from '../../../../assets/img/espon-logo-full.png';

export default (d) => {
	return `
		<span class="scope">${d.scope.split(". ")[1]}</span>
		<h1 class="title">${d.attribute} (${d.period}, ${d.description})</h1>
		<div class="content">
			<img class="map" alt="map" src="${d.mapCanvasData}"/>
		</div>
		<div id="${d.legendComponentId}">
		</div>
		<div class="footer">
			<img class="footer-logo" alt="espon" src="${espon_logo}"/>
		</div>
	`;
}