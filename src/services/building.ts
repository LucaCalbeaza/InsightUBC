import { Room, RoomJSONFull } from "./room";

export type BuildingJSONFull = {
	id: string;
	name: string;
	address: string;
	lat: number;
	lon: number;
	campus?: string;
	rooms: RoomJSONFull[];
};

export class Building {
	constructor(
		public id: string,
		public name: string,
		public address: string,
		public lat: number,
		public lon: number,
		public campus?: string
	) {}

	public rooms: Room[] = [];

	public getJSONFull(): BuildingJSONFull {
		return {
			id: this.id,
			name: this.name,
			address: this.address,
			lat: this.lat,
			lon: this.lon,
			campus: this.campus,
			rooms: this.rooms.map((room) => room.getJSONFull()),
		};
	}

	public static buildBuilding(data: BuildingJSONFull): Building {
		const newBuilding = new Building(data.id, data.name, data.address, data.lat, data.lon, data.campus);
		newBuilding.rooms = data.rooms.map((room: RoomJSONFull) => Room.buildRoom(room, newBuilding));
		return newBuilding;
	}

	public getRooms(): Room[] {
		return this.rooms;
	}

	public getRoomById(id: string): Room | undefined {
		return this.rooms.find((room) => room.id === id);
	}

	public setRoom(
		id: string,
		number: string,
		type: string,
		furniture: string,
		href: string,
		seats: number
	): { replaced: boolean; room: Room } {
		const replaced = this.deleteRoom(id) !== undefined;
		const room = new Room(id, this.id, number, type, furniture, href, seats, this);
		this.rooms.push(room);
		return { replaced, room };
	}

	public deleteRoom(id: string): Room | undefined {
		const index = this.rooms.findIndex((room) => room.id === id);
		if (index < 0) return undefined;
		return this.rooms.splice(index, 1)[0];
	}
}
