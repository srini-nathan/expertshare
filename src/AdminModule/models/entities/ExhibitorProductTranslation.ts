import { SimpleObject } from "../../../AppModule/models";

export class ExhibitorProductTranslation {
    locale: string;

    name: string;

    description: string;

    ctaLabel: string;

    constructor(
        locale: string,
        name = "",
        {
            description = "",
            ctaLabel = "",
        }: Partial<ExhibitorProductTranslation> = {}
    ) {
        this.locale = locale;
        this.name = name;
        this.description = description;
        this.ctaLabel = ctaLabel;
    }

    static createFrom(locale: string, name = ""): ExhibitorProductTranslation {
        return new ExhibitorProductTranslation(locale, name);
    }
}

export type SExhibitorProductTranslation = SimpleObject<ExhibitorProductTranslation>;
