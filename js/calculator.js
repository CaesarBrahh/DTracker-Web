// calculate IUs gained per minute

export function getIUPerMinute(user_inputs) {
	return ((100*user_inputs["uvi"]*user_inputs["clouds"])/user_inputs["fitzpatrick"]) * user_inputs["age"] * user_inputs["skin"];
}
