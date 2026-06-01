// ask browser for GPS locations

export function getUserLocation() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject("Browser does not support geolocation");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			},
			(error) => {
				reject(error);
			}
		);
	});
}
