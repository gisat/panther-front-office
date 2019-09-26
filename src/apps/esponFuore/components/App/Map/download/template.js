import './style.scss';

export default (d) => {
	return `
<!--		<h1>Map ${d.period}</h1>-->
		<img class="map" alt="map" src="${d.mapCanvasData}"/>
	`;
}