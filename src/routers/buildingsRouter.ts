import { Router } from "express";
import { BuildingController } from "../controllers/buildingController";
import type { BuildingService } from "../services/buildingService";

export function createBuildingsRouter(service: BuildingService): Router {
	const router = Router();
	const controller = new BuildingController(service);

	router.get("/api/v2/buildings", controller.getBuildings);
	router.get("/api/v2/buildings/:buildingId", controller.getBuilding);
	router.put("/api/v2/buildings/:buildingId", controller.putBuilding);
	router.delete("/api/v2/buildings/:buildingId", controller.deleteBuilding);
	router.get("/api/v2/buildings/:buildingId/rooms", controller.getRooms);
	router.get("/api/v2/buildings/:buildingId/rooms/:roomId", controller.getRoom);
	router.put("/api/v2/buildings/:buildingId/rooms/:roomId", controller.putRoom);
	router.delete("/api/v2/buildings/:buildingId/rooms/:roomId", controller.deleteRoom);

	return router;
}
