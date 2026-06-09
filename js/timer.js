// modify time on screen for every second passed

export function startTimer(user_inputs, uvi_data, cloud_data) {
	// initialize incrementable values
	let elapsedSeconds = 0;
	let totalIU = 0;

	// startup data
	uvi_data["clouds"] = updateClouds(cloud_data);
	const peakUVIHour = getPeakUVIHour(uvi_data);
	let iuPerMinute = updateUVI(user_inputs, uvi_data, peakUVIHour, avgElement);

	// pull html elements
	const timeElement = document.getElementById("time");
	let avgElement = document.getElementById("iu/min");
	const iuElement = document.getElementById("iu");
	
	const timerId = setInterval(() => {
		// increment time and IU
		elapsedSeconds++;
		totalIU += iuPerMinute / 60;

		// update screen
		timeElement.innerHTML = timeFormat(elapsedSeconds);
		iuElement.innerHTML = `${totalIU.toFixed(2)} IUs Synthesized`;

		// update UVI and cloud data every 5 minutes
		if (elapsedSeconds % 300 == 0) {
			iuPerMinute = updateUVI(user_inputs, uvi_data, peakUVIHour, avgElement);
			uvi_data["clouds"] = updateClouds(cloud_data);
		}

		// stop tracking past 15k IU's
		if (totalIU > 15000) {
			clearInterval(timerId);
		}
	}, 1000);
}

function updateClouds(cloud_data) {
	// pull current time
	const now = new Date();
	const hour = now.getHours();
	const next_hour = hour + 1;
	const minute = now.getMinutes();

	const this_clouds = cloud_data[hour];
	const next_clouds = cloud_data[next_hour];
	const n = Math.trunc(minute / 5);

	if (next_clouds > this_clouds) {
		// clouds are increasing
		var true_clouds = (this_clouds) + (n * ((next_clouds-this_clouds)/12));
	} else if (next_clouds < this_clouds) {
		// clouds are decreasing
		var true_clouds = (this_clouds) - (n * ((this_clouds - next_clouds)/12));
	} else {
		var true_clouds = this_clouds;
	}

	return getCloudFactor(true_clouds);
}

function getCloudFactor(cloud) {
	return 1 - 0.75 * (cloud / 100);
}

function updateUVI(user_inputs, uvi_data, peakUVIHour, avgElement) {
	// pull current time
	const now = new Date();
	const hour = now.getHours();
	const next_hour = hour + 1;
	const minute = now.getMinutes();
	
	// Interpolate time based off this hour's UVI, the next hour's UVI, and hour of the peak UVI
	const this_uvi = uvi_data[hour];
	const next_uvi = uvi_data[next_hour];
	const n = Math.trunc(minute / 5);
	
	if (hour >= peakUVIHour) {
		var true_uvi = (this_uvi) - (n * ((this_uvi - next_uvi) / 12));
	} else {
		var true_uvi = (this_uvi) + (n * ((next_uvi - this_uvi) / 12));	
	}

	// update user_inputs with new UVI
	user_inputs["current_uvi"] = true_uvi;
	console.log(true_uvi);

	// calculate new iuPerMinute
	let newIUPerMinute = calculateIUPerMinute(user_inputs);

	// update avgElement
	avgElement.innerHTML = `${newIUPerMinute.toFixed(2)} IU/min`;

	// return new iuPerMinute
	return calculateIUPerMinute(user_inputs);
}

function timeFormat(seconds) {
	let totalHours = 0;
	while (seconds > 3599) {
		seconds = seconds - 3599;
		totalHours++;
	}

	let totalMinutes = 0;
	while (seconds > 59) {
		seconds = seconds - 59;
		totalMinutes++;
	}

	return `${totalHours} hr ${totalMinutes} min ${seconds} sec`
}

function calculateIUPerMinute(user_inputs) {
	return ((100*user_inputs["current_uvi"]*user_inputs["clouds"]) / user_inputs["fitzpatrick"]) * user_inputs["age"] * user_inputs["skin"];
}

function getPeakUVIHour(uvi_data) {
	let peak = 0;

	for (let i = 0; i < uvi_data.length; i++) {
		if (uvi_data[i] > uvi_data[peak]) {
			peak = i;
		}
	}

	return peak;
}
