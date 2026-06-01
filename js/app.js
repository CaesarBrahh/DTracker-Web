import { getAgeFactor } from "./constants.js";
import { getUserLocation } from "./location.js";

// collect user inputs
let user_inputs = {
	"age": null,
	"fitzpatrick": null,
	"clouds": null,
	"skin": null,
	"uvi": null,
};
const form = document.getElementById("user-inputs");
form.addEventListener("submit", async function(event) {
	// prevent form values from refreshing
	event.preventDefault();	

	// collect and store values
	user_inputs["age"] = getAgeFactor(Number(document.getElementById("age").value));
	user_inputs["fitzpatrick"] = Number(document.getElementById("fitzpatrick").value);
	user_inputs["clouds"] = Number(document.getElementById("clouds").value);
	user_inputs["skin"] = Number(document.getElementById("skin").value);

	// error checking - NEEDS TO BE HANDLED ON FAIL CASE
	for (let val in user_inputs) {
		console.log(val + ": " + String(user_inputs[val]));
	}

	// collect user gps coordinates
	const location = await getUserLocation();

	// error checking - NEEDS TO BE HANDLED ON FAIL CASE
	console.log(location);
});
