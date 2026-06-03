import { getAgeFactor } from "./constants.js";
import { getUserLocation } from "./location.js";
import { getUVIData } from "./weather.js";
import { getIUPerMinute } from "./calculator.js";
import { startTimer } from "./timer.js";

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
	user_inputs["clouds"] = Number(document.getElementById("clouds").value);
	user_inputs["skin"] = Number(document.getElementById("skin").value);

	// error checking - NEEDS TO FAIL GRACEFULLY
	for (let val in user_inputs) {
		console.log(val + ": " + String(user_inputs[val]));
	}

	// collect user gps coordinates
	const location = await getUserLocation();

	// error checking - NEEDS TO FAIL GRACEFULLY
	console.log(location);

	// collect uvi data
	uvi_data = await getUVIData(location); 
	user_inputs["current_uvi"] = Number(uvi_data[0]);

	// error checking - NEEDS FAIL GRACEFULLY
	console.log(`Current UVI: ${user_inputs["current_uvi"]}`);

	// determine current uvi
	const now = new Date();
	user_inputs["current_uvi"] = uvi_data[now.getHours()];

	// start timer
	startTimer(user_inputs, uvi_data);
});
