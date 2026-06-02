// collect uvi data

export async function getUVIData(location) {
	// build API URL using location
	let api_url = `https://api.open-meteo.com/v1/forecast?latitude=${location["latitude"]}&longitude=${location["longitude"]}&hourly=uv_index&timezone=auto`;
	
	// fetch the weather/UVI data
	const response = await fetch(api_url);
	
	// convert response to jSON
	const data = await response.json();
	
	// parse data

	// return data
	return data
}
