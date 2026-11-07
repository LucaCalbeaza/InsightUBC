import { expect } from "chai";
import { GeoLocator } from "../../src/geolocation/GeoLocator";

describe("GeoLocator (online)", function () {
	it("returns coordinates for a known address", async () => {
		const res = await new GeoLocator().searchCoordinates("6245 Agronomy Road V6T 1Z4");

		expect(res.success).to.equal(true);
		expect(res.lat).to.be.closeTo(49.26, 0.01);
		expect(res.lon).to.be.closeTo(-123.25, 0.01);
	});
});
