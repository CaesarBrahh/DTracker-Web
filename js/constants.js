export function getAgeFactor(age) {
	if (age < 50) {
		return 1.0;
	} else if (age < 70) {
		return 0.75;
	} else {
		return 0.5;
	}
}
