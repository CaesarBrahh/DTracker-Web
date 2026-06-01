import { getAgeFactor } from "./constants.js";

// collect user inputs
let user_inputs = {
	"age": null,
	"fitzpatrick": null,
	"clouds": null,
	"skin": null,
};
const form = document.getElementById("user-inputs");
form.addEventListener("submit", function(event) {
	// prevent form values from refreshing
	event.preventDefault();	

	// collect and store values
	user_inputs["age"] = getAgeFactor(Number(document.getElementById("age").value));
	user_inputs["fitzpatrick"] = Number(document.getElementById("fitzpatrick").value);
	user_inputs["clouds"] = Number(document.getElementById("clouds").value);
	user_inputs["skin"] = Number(document.getElementById("skin").value);

	// error checking
	for (let val in user_inputs) {
		console.log(val + ": " + String(user_inputs[val]));
	}
});
