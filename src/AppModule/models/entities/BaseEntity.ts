import { JsonResponseData } from "../apis";

export class BaseEntity {
    id: number;

    createdAt: string | Date;

    updatedAt: string | Date;

    constructor(
        id?: number,
        createdAt?: string | Date,
        updatedAt?: string | Date
    ) {
        // While using this class as a type, we always need ID,
        // but while initializing/creating class we don't have database ID,
        // so we're faking here id, createdAt and updatedAt
        this.id = id || 1;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    getId(): number {
        if (this.id === undefined) {
            throw new Error(
                "Before initialization, you're trying to access `id`"
            );
        }
        return this.id;
    }

    toJSON(addExtraData = false): JsonResponseData {
        if (addExtraData) {
            return {
                id: this.id,
                createdAt: this.createdAt.toString(),
                updatedAt: this.updatedAt.toString(),
            };
        }
        return {};
    }
}
