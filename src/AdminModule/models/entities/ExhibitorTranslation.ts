import { SimpleObject } from "../../../AppModule/models";

export class ExhibitorTranslation {
    locale: string;

    name: string;

    description: string;

    contactUsCaption: string;

    constructor(
        locale: string,
        name = "",
        {
            description = "",
            contactUsCaption = "",
        }: Partial<ExhibitorTranslation> = {}
    ) {
        this.locale = locale;
        this.name = name;
        this.description = description;
        this.contactUsCaption = contactUsCaption;
    }
}

export type SExhibitorTranslation = SimpleObject<ExhibitorTranslation>;
