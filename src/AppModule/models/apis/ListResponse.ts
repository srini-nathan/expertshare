export class ListResponse<T> {
    items: T[];

    totalItems: number;

    constructor(items: T[] = [], totalItems = null) {
        this.items = items;
        this.totalItems = totalItems || items.length;
    }
}
