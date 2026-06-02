// modify time on screen for every second passed

export function startTimer(iuPerMinute) {
	let elapsedSeconds = 0;
	let totalIU = 0;
	const timeElement = document.getElementById("time");
	const avgElement = document.getElementById("iu/min");
	const iuElement = document.getElementById("iu");

	avgElement.innerHTML = `${iuPerMinute} IU/min`;

	setInterval(() => {
		// increment time and IU
		elapsedSeconds++;
		totalIU += iuPerMinute / 60;

		// update screen
		timeElement.innerHTML = timeFormat(elapsedSeconds);
		iuElement.innerHTML = `${totalIU} IUs Synthesized`;
	}, 1000);
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
