import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { ExhibitorCategoryApi } from "../../apis";
import { Container } from "./Container";

export class ExhibitorCategory extends BaseEntity {
    name: string;

    translations?: any;

    container: string | Container;

    constructor(
        container: string,
        {
            name = "",
            translations,
            id,
            createdAt,
            updatedAt,
        }: Partial<ExhibitorCategory> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.name = name;
        this.translations = translations;
    }

    toString(): string {
        return ExhibitorCategoryApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            translations: this.translations,
            container: this.container.toString(),
        };
    }
}

export type PExhibitorCategory = Partial<ExhibitorCategory>;
