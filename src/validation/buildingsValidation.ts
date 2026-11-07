export function validateBuildingParams(name: any, address: any, lat: any, lon: any): { valid: boolean; fields: any } {
	let valid = true;
	const error: any = {};
	if (name === undefined) {
		error.name = "required but missing";
		valid = false;
	} else if (typeof name !== "string") {
		error.name = "expected a string";
		valid = false;
	}
	if (address === undefined) {
		error.address = "required but missing";
		valid = false;
	} else if (typeof address !== "string") {
		error.address = "expected a string";
		valid = false;
	}
	if (lat === undefined) {
		error.lat = "required but missing";
		valid = false;
	} else if (typeof lat !== "number") {
		error.lat = "expected a number";
		valid = false;
	}
	if (lon === undefined) {
		error.lon = "required but missing";
		valid = false;
	} else if (typeof lon !== "number") {
		error.lon = "expected a number";
		valid = false;
	}
	return {
		valid: valid,
		fields: error,
	};
}
export function validateRoomParams(params: any, buildingId: string): { valid: boolean; fields: any } {
	let valid = true;
	const error: any = {};
	if (params.building === undefined) {
		error.building = "required but missing";
		valid = false;
	} else if (typeof params.building !== "string") {
		error.building = "expected a string";
		valid = false;
	} else if (params.building !== buildingId) {
		error.building = "must match parent building in path";
		valid = false;
	}
	if (params.number === undefined) {
		error.number = "required but missing";
		valid = false;
	} else if (typeof params.number !== "string") {
		error.number = "expected a string";
		valid = false;
	}
	if (params.type === undefined) {
		error.type = "required but missing";
		valid = false;
	} else if (typeof params.type !== "string") {
		error.type = "expected a string";
		valid = false;
	}
	if (params.furniture === undefined) {
		error.furniture = "required but missing";
		valid = false;
	} else if (typeof params.furniture !== "string") {
		error.furniture = "expected a string";
		valid = false;
	}
	if (params.href === undefined) {
		error.href = "required but missing";
		valid = false;
	} else if (typeof params.href !== "string") {
		error.href = "expected a string";
		valid = false;
	}
	if (params.seats === undefined || params.seats === null) {
		error.seats = "required but missing";
		valid = false;
	} else if (typeof params.seats !== "number" || params.seats < 0 || !Number.isInteger(params.seats)) {
		error.seats = "expected a number >= 0";
		valid = false;
	}
	return {
		valid: valid,
		fields: error,
	};
}
