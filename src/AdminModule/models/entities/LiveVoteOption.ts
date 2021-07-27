import { LiveVoteOptionTranslation } from "./LiveVoteOptionTranslation";
import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";

export class LiveVoteOption extends BaseEntity {
    coverImg: string;

    ord: number;

    translations: LiveVoteOptionTranslation[];

    constructor({
        coverImg = "",
        ord = 1,
        translations = [],
        id,
        createdAt,
        updatedAt,
    }: Partial<LiveVoteOption> = {}) {
        super(id, createdAt, updatedAt);
        this.coverImg = coverImg;
        this.ord = ord;
        this.translations = translations;
    }
}
