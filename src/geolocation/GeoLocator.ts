import { IGeoLocator, GeoCoordResponse } from "./IGeoLocator";
import { StatusCodes } from "http-status-codes";

const geoServiceUrl = "http://cs310.students.cs.ubc.ca:11316/api/v1/geolocation/";
const GEO_SERVICE_TIMEOUT_MS = 5000;

type CoordResponseFormat = {
	lat?: number;
	lon?: number;
	error?: string;
};

export class GeoLocator implements IGeoLocator {
	async searchCoordinates(address: string): Promise<GeoCoordResponse> {
		const url = geoServiceUrl + encodeURIComponent(address);
		let res: Response;
		let body: CoordResponseFormat | null;
		try {
			res = await fetch(url, { signal: AbortSignal.timeout(GEO_SERVICE_TIMEOUT_MS) });
			body = (await res.json()) as any;
		} catch {
			// geolocation service unreachable, too slow, or returned a non-JSON response; skip this building
			return { success: false };
		}

		if (
        body !== undefined &&
        body !== null &&
        res.status === StatusCodes.OK &&
        !body.error &&
        body.lat &&
        body.lon
    	) {
        	return { success: true, lat: body.lat, lon: body.lon };
    	}

		return { success: false };
	}
}
