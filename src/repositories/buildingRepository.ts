import fs from "fs/promises";
import { DataDirectory } from "./dataDirectory";
import { Building, BuildingJSONFull } from "../services/building";
import type { BuildingRepository } from "../services/buildingService";

export class FsBuildingRepository implements BuildingRepository {
	private getPath(): string {
		return `${DataDirectory.getInstance().getDataDirectory()}/buildings.json`;
	}

	public async load(): Promise<Building[]> {
		try {
			const json: BuildingJSONFull[] = JSON.parse(await fs.readFile(this.getPath(), "utf-8"));
			return json.map((building) => Building.buildBuilding(building));
		} catch {
			return [];
		}
	}

	public async save(buildings: Building[]): Promise<void> {
		await fs.writeFile(this.getPath(), JSON.stringify(buildings.map((building) => building.getJSONFull())));
	}
}
