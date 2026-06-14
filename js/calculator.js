// calculate IUs gained per minute

export function calculateSessionTimeline(user_inputs, uvi_data, cloud_data) {
    	// each hour's calculated info will be stored within this array
	const timeline = [];

	// loop through each hour of the day
   	for (let hour = 0; hour < 24; hour++) {
		// starting hour
        	const blockStart = new Date();
        	blockStart.setHours(hour, 0, 0, 0);

		// ending hour
        	const blockEnd = new Date();
        	blockEnd.setHours(hour + 1, 0, 0, 0);

		// pull uvi and cloud data for THIS hour 
		const uvi = Number(uvi_data[hour]);
        	const clouds = Number(cloud_data[hour]);
        	const cloudFactor = calculateCloudFactor(clouds);

		// update user_inputs object with uvi and clouds data for THIS hour
        	const tempInputs = {
            		...user_inputs,
            		current_uvi: uvi,
            		clouds: cloudFactor
        	};

		// add new hourly block into the timeline array
        	timeline.push({
            		'startMs': blockStart.getTime(),
            		'endMs': blockEnd.getTime(),
            		'uvi': uvi,
            		'clouds': clouds,
            		'cloudFactor': cloudFactor,
            		'iuPerMinute': calculateIUPerMinute(tempInputs)
        	});
    	}

    	return timeline;
}

function calculateCloudFactor(clouds) {
	return 1 - 0.75 * (clouds / 100);
}
	
function calculateIUPerMinute(user_inputs) {
	return ((100*user_inputs["current_uvi"]*user_inputs["clouds"]) / user_inputs["fitzpatrick"]) * user_inputs["age"] * user_inputs["skin"];
}
