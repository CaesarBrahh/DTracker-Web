// modify time on screen for every second passed

export function startTimer(timeline) {
	// pull html elements
	const timeElement = document.getElementById("time");
	const avgElement = document.getElementById("iu/min");
	const iuElement = document.getElementById("iu");
	const uviElement = document.getElementById("uvi");
	const cloudsElement = document.getElementById("clouds");

	// set start time
	const sessionStartMs = Date.now();

	// run timer
	const timerId = setInterval(() => {
		// determine total IU
		const nowMs = Date.now();
		const elapsedSeconds = Math.floor((nowMs - sessionStartMs) / 1000);
		const totalIU = calculateTotalIU(sessionStartMs, nowMs, timeline);
		const current = timeline[new Date(nowMs).getHours()];	

		// display total IU
		iuElement.innerHTML = `${totalIU.toFixed(2)} IUs Synthesized`;

		// display current iu/min
		avgElement.innerHTML = `${current['iuPerMinute'].toFixed(2)} IU/min`;

		// display current UVI 
		uviElement.innerHTML = `UVI: ${current['uvi'].toFixed(2)}`;
		
		// display current Cloud Coverage
		cloudsElement.innerHTML = `Cloud Coverage: ${current['clouds']}%`;

		// display time
		timeElement.innerHTML = timeFormat(elapsedSeconds);

		// end session if total ui > 15,000
		if (totalIU > 15000) {
			alert("Tracking stopped. 15,000 IU limit reached.");
			clearInterval(timerId);
		}

		// end session if uvi < 3
		if (current['uvi'] < 3) {
			//alert("Tracked stopped. UVI has fallen below 3.");
			//clearInterval(timerId);
		}
	}, 1000);
}

function calculateTotalIU(sessionStartMs, nowMs, timeline) {
	// start the running iu total
	let totalIU = 0;

	// loop through each timeblock in timeline
	for (const block of timeline) {
		// determine when user's session overlaps this block
		const overlapStart = Math.max(sessionStartMs, block['startMs']);

		// determine when overlap ends
		const overlapEnd = Math.min(nowMs, block['endMs']);

		// check whether session actually touched the block
		if (overlapEnd > overlapStart) {
			// convert overlapped time from ms -> min
			const minutes = (overlapEnd - overlapStart) / 1000 / 60;

			// increment totalIU
			totalIU += (block['iuPerMinute'] * minutes);
		}
	}	
	
	// return totalIU
	return totalIU;
}

function _startTimer(user_inputs, uvi_data, cloud_data) {
	// initialize incrementable values
	let elapsedSeconds = 0;
	let totalIU = 0;

	// pull html elements
	const timeElement = document.getElementById("time");
	let avgElement = document.getElementById("iu/min");
	const iuElement = document.getElementById("iu");
	const uviElement = document.getElementById("uvi");
	const cloudsElement = document.getElementById("clouds");


	// startup data
	user_inputs["clouds"] = updateClouds(cloud_data, cloudsElement);
	const peakUVIHour = getPeakUVIHour(uvi_data);
	let iuPerMinute = updateUVI(user_inputs, uvi_data, peakUVIHour, avgElement);
	uviElement.innerHTML = `UVI: ${user_inputs["current_uvi"].toFixed(2)}`;
	
	const startTime = Date.now();
	const timerId = setInterval(() => {
		// increment time and IU
		elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
		totalIU = iuPerMinute * (elapsedSeconds / 60);

		// update screen
		timeElement.innerHTML = timeFormat(elapsedSeconds);
		iuElement.innerHTML = `${totalIU.toFixed(2)} IUs Synthesized`;

		// update UVI and cloud data every 5 minutes
		if (elapsedSeconds % 300 == 0) {
			user_inputs["clouds"] = updateClouds(cloud_data, cloudsElement);
			iuPerMinute = updateUVI(user_inputs, uvi_data, peakUVIHour, avgElement);
			uviElement.innerHTML = `UVI: ${user_inputs["current_uvi"].toFixed(2)}`;
		}

		// stop tracking past 15k IU's
		if (totalIU > 15000) {
			alert("Tracking stopped: 15,000 IU limit reached.");
			clearInterval(timerId);
		}
		
		// stop tracking belwo 3 UVI
		/*if (user_inputs["current_uvi"] < 3) {
			alert("Tracking stopped: UV Index has fallen below 3.");
			clearInterval(timerId);
		}*/
	}, 1000);
}

function updateClouds(cloud_data, cloudsElement) {
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

	// update html element
	cloudsElement.innerHTML = `Cloud Coverage: ${true_clouds.toFixed(2)}%`;
	console.log(true_clouds);

	return getCloudFactor(true_clouds);
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
	console.log(newIUPerMinute);

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

function getPeakUVIHour(uvi_data) {
	let peak = 0;

	for (let i = 0; i < uvi_data.length; i++) {
		if (uvi_data[i] > uvi_data[peak]) {
			peak = i;
		}
	}

	return peak;
}
