import mapHelpers from './maps';

const getDates = (geometry) => {
	const url = 'http://lpisup.gisat.cz/backend/rest/imagemosaic/getDates';

	const geometryWithSrid = {
		...geometry,
		crs: {
			"type": "name",
			"properties": {
				"name": "urn:ogc:def:crs:EPSG::4326"
			}
		}
	}

	const data = {data: {
		geometry: geometryWithSrid
	}};

	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then(response => {
		if (response.status === 200) {
			return response.json();
		}
	});
}

const ensureDatesForMapSetExtent = (mapSet) => {
	const view = mapSet.data.view;
	//get boundary geojson
	const boundingGeometry = mapHelpers.getGeometryFromView(view);
	return getDates(boundingGeometry.geometry).then(results => ({dates:results.dates, boundingGeometry}));
}


export default {
	ensureDatesForMapSetExtent,
	getDates,
}