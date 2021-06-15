import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { Container } from "./Container";
import { EmailTemplateApi } from "../../apis";

export class EmailTemplate extends BaseEntity {
    name: string;

    subject: string;

    etKey: string;

    content: string;

    container: string | Container;

    constructor(
        container: string,
        {
            name = "",
            subject = "",
            etKey = "",
            content = "",
            id,
            createdAt,
            updatedAt,
        }: Partial<EmailTemplate> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.name = name;
        this.subject = subject;
        this.etKey = etKey;
        this.content = content;
    }

    toString(): string {
        return EmailTemplateApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            subject: this.subject,
            etKey: this.etKey,
            content: this.content,
            container: this.container.toString(),
        };
    }
}
