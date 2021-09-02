import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { DocFile } from "../DocFile";

export class ExhibitorProductDoc extends BaseEntity implements DocFile {
    name: string;

    fileName: string;

    exhibitorProduct: string;

    container: string;

    // virtual field
    size = "";

    constructor(
        container: string,
        exhibitorProduct: string,
        {
            id,
            createdAt,
            updatedAt,
            name = "",
            fileName = "",
        }: PExhibitorProductDoc = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.exhibitorProduct = exhibitorProduct;
        this.name = name;
        this.fileName = fileName;
    }
}

export type PExhibitorProductDoc = Partial<ExhibitorProductDoc>;
