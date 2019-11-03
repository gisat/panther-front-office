import './style.scss';
import espon_logo from '../../../../assets/img/espon-logo-full.png';

export default (d) => {
	return `
		<span class="scope">${d.scope.split(". ")[1]}</span>
		<h1 class="title">${d.attribute} (${d.period})</h1>
		<p class="description">
			${d.description}
		</p>
		<div class="content">
			<img id="${d.mapComponentId}" class="map" alt="map" src="${d.mapCanvasData}"/>
			<div class="legend-scale-container">
				<div id="${d.legendComponentId}"></div>
				<div id="esponFuore-map-scale">
					<div class="scale-wrapper">
						<div id="${d.scaleLineId}"></div>
						<div id="${d.scaleLabelId}"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="footer">
			<img class="footer-logo" alt="espon" src="${espon_logo}"/>
		</div>
	`;
}