import type { Request, Response } from "express";
import { validateGetParams } from "../validation/coursesValidation";
import { validateBuildingParams, validateRoomParams } from "../validation/buildingsValidation";
import type { Building } from "../services/building";
import type { Room } from "../services/room";
import type { BuildingService } from "../services/buildingService";

const prefixBuildings = "/api/v2/buildings";

function buildingJSONLinks(building: Building): object {
	return {
		id: building.id,
		name: building.name,
		address: building.address,
		lat: building.lat,
		lon: building.lon,
		campus: building.campus,
		links: {
			self: `${prefixBuildings}/${building.id}`,
			rooms: `${prefixBuildings}/${building.id}/rooms`,
		},
	};
}

function buildingJSONForDelete(building: Building): object {
	return {
		id: building.id,
		name: building.name,
		address: building.address,
		lat: building.lat,
		lon: building.lon,
		rooms: building.rooms.length,
		campus: building.campus,
	};
}

function roomJSONLinks(room: Room): object {
	return {
		...room.getJSONFull(),
		links: {
			self: `${prefixBuildings}/${room.building}/rooms/${room.id}`,
			building: `${prefixBuildings}/${room.building}`,
		},
	};
}

function sendNotFound(res: Response, kind: "building" | "room", id: string): void {
	res.status(404).send({ error: "Not found", message: `no ${kind} with id '${id}'` });
}

function sendValidationFailed(res: Response, fields: any): void {
	res.status(422).send({ error: "Validation failed", fields: fields });
}

// Returns undefined after sending a 400 if limit/offset are invalid.
function readPage(req: Request, res: Response): { limit: number; offset: number } | undefined {
	const limit = req.query.limit !== undefined ? Number(req.query.limit) : 100;
	const offset = req.query.offset !== undefined ? Number(req.query.offset) : 0;
	const valid = validateGetParams(limit, offset);
	if (!valid.valid) {
		res.status(400).json({ error: "Invalid request parameters", params: valid.fields });
		return undefined;
	}
	return { limit, offset };
}

function pageOf(items: object[], limit: number, offset: number): object {
	return { total: items.length, limit: limit, offset: offset, items: items.slice(offset, offset + limit) };
}

export class BuildingController {
	constructor(private service: BuildingService) {}

	public getBuildings = async (req: Request, res: Response): Promise<void> => {
		const page = readPage(req, res);
		if (page === undefined) return;
		const buildings = (await this.service.getBuildings()).map(buildingJSONLinks);
		res.status(200).json(pageOf(buildings, page.limit, page.offset));
	};

	public getBuilding = async (req: Request, res: Response): Promise<void> => {
		const { buildingId } = req.params;
		const building = await this.service.getBuilding(buildingId);
		if (building === undefined) return sendNotFound(res, "building", buildingId);
		res.status(200).send(buildingJSONLinks(building));
	};

	public putBuilding = async (req: Request, res: Response): Promise<void> => {
		const { buildingId } = req.params;
		const { name, address, lat, lon, campus } = req.body;
		const valid = validateBuildingParams(name, address, lat, lon);
		if (!valid.valid) return sendValidationFailed(res, valid.fields);
		const output = await this.service.putBuilding(buildingId, name, address, lat, lon, campus);
		if (output.replaced) res.status(204).send();
		else res.status(201).send(buildingJSONLinks(output.building));
	};

	public deleteBuilding = async (req: Request, res: Response): Promise<void> => {
		const { buildingId } = req.params;
		const building = await this.service.deleteBuilding(buildingId);
		if (building === undefined) return sendNotFound(res, "building", buildingId);
		res.status(200).send(buildingJSONForDelete(building));
	};

	public getRooms = async (req: Request, res: Response): Promise<void> => {
		const { buildingId } = req.params;
		const building = await this.service.getBuilding(buildingId);
		if (building === undefined) return sendNotFound(res, "building", buildingId);
		const page = readPage(req, res);
		if (page === undefined) return;
		res.status(200).send(pageOf(building.getRooms().map(roomJSONLinks), page.limit, page.offset));
	};

	public getRoom = async (req: Request, res: Response): Promise<void> => {
		const { buildingId, roomId } = req.params;
		const building = await this.service.getBuilding(buildingId);
		if (building === undefined) return sendNotFound(res, "building", buildingId);
		const room = building.getRoomById(roomId);
		if (room === undefined) return sendNotFound(res, "room", roomId);
		res.status(200).send(roomJSONLinks(room));
	};

	public putRoom = async (req: Request, res: Response): Promise<void> => {
		const { buildingId, roomId } = req.params;
		// A missing building must win over invalid params (404 before 422).
		if ((await this.service.getBuilding(buildingId)) === undefined) return sendNotFound(res, "building", buildingId);
		const valid = validateRoomParams(req.body, buildingId);
		if (!valid.valid) return sendValidationFailed(res, valid.fields);
		const { number, type, furniture, href, seats } = req.body;
		const output = await this.service.putRoom(buildingId, roomId, number, type, furniture, href, seats);
		if (output === undefined) return sendNotFound(res, "building", buildingId);
		if (output.replaced) res.status(204).send();
		else res.status(201).send(roomJSONLinks(output.room));
	};

	public deleteRoom = async (req: Request, res: Response): Promise<void> => {
		const { buildingId, roomId } = req.params;
		if ((await this.service.getBuilding(buildingId)) === undefined) return sendNotFound(res, "building", buildingId);
		const room = await this.service.deleteRoom(buildingId, roomId);
		if (room === undefined) return sendNotFound(res, "room", roomId);
		res.status(200).send(room.getJSONFull());
	};
}
