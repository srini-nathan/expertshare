import {
    ExhibitorProductTranslation,
    SExhibitorProductTranslation,
} from "./ExhibitorProductTranslation";
import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { Container } from "./Container";
import { ExhibitorProductApi } from "../../apis";
import { Exhibitor } from "./Exhibitor";

export class ExhibitorProduct extends BaseEntity {
    translations: ExhibitorProductTranslation[] | SExhibitorProductTranslation;

    name: string;

    description: string;

    ctaLabel: string;

    imageName: string;

    isActive: boolean;

    isCta: boolean;

    ctaUrl: string;

    price: string;

    container: string | Container;

    exhibitor: string | Exhibitor;

    exhibitorProductTags: any[];

    exhibitorProductDocs: string[];

    constructor(
        container: string | Container,
        exhibitor: string | Exhibitor,
        {
            id,
            createdAt,
            updatedAt,
            translations = [],
            name = "",
            description = "",
            ctaLabel = "",
            imageName = "",
            isActive = true,
            isCta = false,
            ctaUrl = "",
            price = "",
            exhibitorProductTags = [],
            exhibitorProductDocs = [],
        }: PExhibitorProduct = {}
    ) {
        super(id, createdAt, updatedAt);
        this.translations = translations;
        this.container = container;
        this.exhibitor = exhibitor;
        this.name = name;
        this.description = description;
        this.ctaLabel = ctaLabel;
        this.imageName = imageName;
        this.isActive = isActive;
        this.isCta = isCta;
        this.ctaUrl = ctaUrl;
        this.price = price;
        this.exhibitorProductTags = exhibitorProductTags;
        this.exhibitorProductDocs = exhibitorProductDocs;
    }

    toString(): string {
        return ExhibitorProductApi.toResourceUrl(this.id);
    }
}

export type PExhibitorProduct = Partial<ExhibitorProduct>;
