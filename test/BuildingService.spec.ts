import { expect } from "chai";
import { Building, BuildingJSONFull } from "../src/services/building";
import { BuildingRepository, BuildingService } from "../src/services/buildingService";

class FakeBuildingRepository implements BuildingRepository {
	private stored: BuildingJSONFull[] = [];

	public async load(): Promise<Building[]> {
		return this.stored.map((building) => Building.buildBuilding(building));
	}

	public async save(buildings: Building[]): Promise<void> {
		this.stored = buildings.map((building) => building.getJSONFull());
	}
}

describe("BuildingService", () => {
	let service: BuildingService;

	beforeEach(() => {
		service = new BuildingService(new FakeBuildingRepository());
	});

	it("finds a building's coordinates by id, and nothing for an unknown id", async () => {
		await service.putBuilding("ICCS", "ICCS", "2366 Main Mall", 50, -120);

		expect(await service.getCoordinates("ICCS")).to.deep.equal({ lat: 50, lon: -120 });
		expect(await service.getCoordinates("NA")).to.equal(undefined);
	});

	it("replaces an existing building and drops its rooms", async () => {
		await service.putBuilding("ICCS", "Old name", "Old address", 1, 2);
		await service.putRoom("ICCS", "ICCS001", "001", "Lecture", "Tables", "href", 30);

		const output = await service.putBuilding("ICCS", "New name", "New address", 3, 4);

		const building = await service.getBuilding("ICCS");
		expect(output.replaced).to.equal(true);
		expect(building?.name).to.equal("New name");
		expect(building?.getRooms()).to.deep.equal([]);
		expect(await service.getBuildings()).to.have.length(1);
	});

	it("deletes a building's rooms along with the building", async () => {
		await service.putBuilding("ICCS", "ICCS", "2366 Main Mall", 1, 2);
		await service.putRoom("ICCS", "ICCS001", "001", "Lecture", "Tables", "href", 30);

		await service.deleteBuilding("ICCS");

		expect(await service.getBuilding("ICCS")).to.equal(undefined);
		expect(await service.getAllRooms()).to.deep.equal([]);
	});

	it("does not add a room to a building that doesn't exist", async () => {
		const output = await service.putRoom("NOPE", "NOPE001", "001", "Lecture", "Tables", "href", 30);

		expect(output).to.equal(undefined);
		expect(await service.getAllRooms()).to.deep.equal([]);
	});
});
