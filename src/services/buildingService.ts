import { Building } from "./building";
import type { Room } from "./room";

export interface BuildingRepository {
	load(): Promise<Building[]>;
	save(buildings: Building[]): Promise<void>;
}

export class BuildingService {
	constructor(private repository: BuildingRepository) {}

	public async getBuildings(): Promise<Building[]> {
		return await this.repository.load();
	}

	public async saveBuildings(buildings: Building[]): Promise<void> {
		await this.repository.save(buildings);
	}

	public async getBuilding(buildingId: string): Promise<Building | undefined> {
		return (await this.repository.load()).find((building) => building.id === buildingId);
	}

	public async getCoordinates(buildingId: string): Promise<{ lat: number; lon: number } | undefined> {
		const building = await this.getBuilding(buildingId);
		if (building === undefined) return undefined;
		return { lat: building.lat, lon: building.lon };
	}

	public async putBuilding(
		buildingId: string,
		name: string,
		address: string,
		lat: number,
		lon: number,
		campus?: string
	): Promise<{ replaced: boolean; building: Building }> {
		const buildings = await this.repository.load();
		const replaced = buildings.some((building) => building.id === buildingId);
		const remaining = buildings.filter((building) => building.id !== buildingId);
		const building = new Building(buildingId, name, address, lat, lon, campus);
		remaining.push(building);
		await this.repository.save(remaining);
		return { replaced, building };
	}

	public async deleteBuilding(buildingId: string): Promise<Building | undefined> {
		const buildings = await this.repository.load();
		const index = buildings.findIndex((building) => building.id === buildingId);
		if (index < 0) return undefined;
		const [deleted] = buildings.splice(index, 1);
		await this.repository.save(buildings);
		return deleted;
	}

	public async getAllRooms(): Promise<Room[]> {
		return (await this.repository.load()).flatMap((building) => building.getRooms());
	}

	public async putRoom(
		buildingId: string,
		roomId: string,
		number: string,
		type: string,
		furniture: string,
		href: string,
		seats: number
	): Promise<{ replaced: boolean; room: Room } | undefined> {
		const buildings = await this.repository.load();
		const building = buildings.find((b) => b.id === buildingId);
		if (building === undefined) return undefined;
		const output = building.setRoom(roomId, number, type, furniture, href, seats);
		await this.repository.save(buildings);
		return output;
	}

	public async deleteRoom(buildingId: string, roomId: string): Promise<Room | undefined> {
		const buildings = await this.repository.load();
		const room = buildings.find((b) => b.id === buildingId)?.deleteRoom(roomId);
		if (room === undefined) return undefined;
		await this.repository.save(buildings);
		return room;
	}
}
