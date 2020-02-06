import mapHelpers from '../../../../utils/map';

const getDates = (geometry, getDatesUrl) => {
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

	return fetch(getDatesUrl, {
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

const ensureDatesForMapSetExtent = (mapSet, getDatesUrl) => {
	const view = mapSet.data.view;
	//get boundary geojson
	const boundingGeometry = mapHelpers.getGeometryFromView(view);
	return getDates(boundingGeometry.geometry, getDatesUrl).then(results => ({dates:results.dates, boundingGeometry}));
}


export default {
	ensureDatesForMapSetExtent,
	getDates,
}