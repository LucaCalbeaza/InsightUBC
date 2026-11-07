import { Queryable } from "./queryable";
import type { Building } from "./building";

export type RoomJSONFull = {
	id: string;
	building: string;
	number: string;
	type: string;
	furniture: string;
	href: string;
	seats: number;
};

export class Room implements Queryable {
	constructor(
		public id: string,
		public building: string,
		public number: string,
		public type: string,
		public furniture: string,
		public href: string,
		public seats: number,
		public building_obj: Building
	) {}

	public getJSONFull(): RoomJSONFull {
		return {
			id: this.id,
			building: this.building,
			number: this.number,
			type: this.type,
			furniture: this.furniture,
			href: this.href,
			seats: this.seats,
		};
	}

	public static buildRoom(data: RoomJSONFull, building: Building): Room {
		const { id, number, type, furniture, href, seats } = data;
		return new Room(id, data.building, number, type, furniture, href, seats, building);
	}

	public getValue(key: string): any {
		if (["name", "address", "lat", "lon", "campus"].includes(key)) return (this.building_obj.getJSONFull() as any)[key];
		else return (this.getJSONFull() as any)[key];
	}

	public isSame(other: Queryable): boolean {
		return other instanceof Room && this.id === other.id && this.building === other.building;
	}
}
