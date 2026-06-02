// modify time on screen for every second passed

export function startTimer(user_inputs, uvi_data) {
	let elapsedSeconds = 0;
	let totalIU = 0;

	let iuPerMinute = calculateIUPerMinute(user_inputs);
	const peakUVIHour = getPeakUVIHour(uvi_data);

	const timeElement = document.getElementById("time");
	let avgElement = document.getElementById("iu/min");
	const iuElement = document.getElementById("iu");

	updateUVI(user_inputs, uvi_data, peakUVIHour, avgElement);

	const timerId = setInterval(() => {
		// increment time and IU
		elapsedSeconds++;
		totalIU += iuPerMinute / 60;

		// update screen
		timeElement.innerHTML = timeFormat(elapsedSeconds);
		iuElement.innerHTML = `${totalIU} IUs Synthesized`;

		// update UVI every 5 minutes
		if (elapsedSeconds % 300 == 0) {
			iuPerMinute = updateUVI(user_inputs, uvi_data, peakUVIHour, avgElement);
		}

		// stop tracking past 15k IU's
		if (totalIU > 15000) {
			clearInterval(timerId);
		}
	}, 1000);
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

	// calculate new iuPerMinute
	let newIUPerMinute = calculateIUPerMinute(user_inputs);

	// update avgElement
	avgElement.innerHTML = `${newIUPerMinute} IU/min`;

	// return new iuPerMinute
	return calculateIUPerMinute(user_inputs);
}

function timeFormat(seconds) {
	let totalHours = 0;
	while (seconds > 3600) {
		seconds = seconds - 3600;
		totalHours++;
	}

	let totalMinutes = 0;
	while (seconds > 60) {
		seconds = seconds - 60;
		totalMinutes++;
	}

	return `${totalHours} hrs ${totalMinutes} minutes ${seconds} seconds`
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
