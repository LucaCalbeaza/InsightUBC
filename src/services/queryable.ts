export interface Queryable {
	getValue(key: string): any;
	isSame(other: Queryable): boolean;
}
