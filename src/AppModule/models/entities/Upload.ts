import { BaseEntity } from "./BaseEntity";

export class Upload extends BaseEntity {
    container?: string;

    fileName?: string;

    fileType?: string;

    file?: File | Blob;

    constructor({
        container,
        fileName,
        fileType,
        file,
        id,
        createdAt,
        updatedAt,
    }: Partial<Upload>) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.fileName = fileName;
        this.fileType = fileType;
        this.file = file;
    }
}
