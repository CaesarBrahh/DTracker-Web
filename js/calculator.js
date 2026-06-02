// calculate IUs gained per minute

export function getIUPerMinute(user_inputs) {
	for (let val in user_inputs) {
		console.log(`${val}: ${user_inputs[val]}: ${typeof user_inputs[val]}`);
	}
	return ((100*user_inputs["current_uvi"]*user_inputs["clouds"]) / user_inputs["fitzpatrick"]) * user_inputs["age"] * user_inputs["skin"];
}
