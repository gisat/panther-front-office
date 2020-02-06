const getDates = (geometry) => {
	const url = 'http://dromas.gisat.cz/backend/rest/imagemosaic/getDates';
	const data = {data: {
		geometry
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

export default {
    getDates,
}