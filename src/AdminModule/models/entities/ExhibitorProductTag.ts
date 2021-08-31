import { BaseEntity } from "../../../AppModule/models";
import { ExhibitorProductTagApi } from "../../apis";

export class ExhibitorProductTag extends BaseEntity {
    name: string;

    container: string;

    constructor({
        name = "",
        container = "",
        id,
        createdAt,
        updatedAt,
    }: Partial<ExhibitorProductTag> = {}) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.name = name;
    }

    toString(): string {
        return ExhibitorProductTagApi.toResourceUrl(this.id);
    }
}
export type PExhibitorProductTag = Partial<ExhibitorProductTag>;
