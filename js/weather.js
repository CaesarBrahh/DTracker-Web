// collect uvi data

export async function getUVIData(location) {
	// build API URL using location
	let api_url = `https://api.open-meteo.com/v1/forecast?latitude=${location["latitude"]}&longitude=${location["longitude"]}&hourly=uv_index,cloud_cover&timezone=auto`;
	
	// fetch the weather/UVI data
	const response = await fetch(api_url);
	
	// convert response to jSON
	const data = await response.json();
	console.log(data);
	
	// parse data
	const parsed_uvi_data = data["hourly"]["uv_index"].slice(0, 24);
	const parsed_cloud_data = data["hourly"]["cloud_cover"].slice(0, 24);

	console.log(parsed_uvi_data);
	console.log(parsed_cloud_data);

	// return data
	return {
		uvi_data: parsed_uvi_data, 
		cloud_data: parsed_cloud_data
	};
}
