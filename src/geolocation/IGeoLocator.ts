export type GeoCoordResponse = {
	success: boolean;
	lat?: number;
	lon?: number;
};

export interface IGeoLocator {
	searchCoordinates(address: string): Promise<GeoCoordResponse>;
}
