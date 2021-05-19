import { BaseEntity } from "../../../AppModule/models";

export class ContainerView extends BaseEntity {
    name: string;

    description: string;

    imageName: string;

    constructor({
        name = "",
        description = "",
        imageName = "",
        id,
        createdAt,
        updatedAt,
    }: Partial<ContainerView>) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.description = description;
        this.imageName = imageName;
    }
}
