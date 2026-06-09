import { getAgeFactor } from "./constants.js";
import { getUserLocation } from "./location.js";
import { getUVIData } from "./weather.js";
import { getIUPerMinute } from "./calculator.js";
import { startTimer } from "./timer.js";

// todo:
// use cloud data from api
// collecting gps doesn't work on mobile

// collect user inputs
let user_inputs = {
	"age": null,
	"fitzpatrick": null,
	"clouds": null,
	"skin": null,
	"current_uvi": null,
};
let uvi_data = null;
const form = document.getElementById("user-inputs");
form.addEventListener("submit", async function(event) {
	// prevent form values from refreshing
	event.preventDefault();	

	// collect and store values
	user_inputs["age"] = getAgeFactor(Number(document.getElementById("age").value));
	user_inputs["fitzpatrick"] = Number(document.getElementById("fitzpatrick").value);
	// user_inputs["clouds"] = Number(document.getElementById("clouds").value);
	user_inputs["skin"] = Number(document.getElementById("skin").value);

	// collect user gps coordinates
	try {
		var location = await getUserLocation();
	} catch (error) {
		alert("Location access failed.");
		console.error(error);
		return;
	}

	// collect uvi and cloud data
	try {
		var { uvi_data, cloud_data } = await getUVIData(location); 
	} catch(error) {
		alert("Weather request to Open-Meteo failed.");
		console.error(error);
		return;
	}
	user_inputs["current_uvi"] = Number(uvi_data[0]);
	user_inputs["clouds"] = Number(cloud_data[0]);
	console.log(user_inputs);

	// determine current uvi
	const now = new Date();
	user_inputs["current_uvi"] = uvi_data[now.getHours()];

	// start timer
	startTimer(user_inputs, uvi_data, cloud_data);
});
