import { LiveVoteOptionTranslation } from "./LiveVoteOptionTranslation";
import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { getRandomId, getUTCDate } from "../../../AppModule/utils";

export class LiveVoteOption extends BaseEntity {
    imageName: string;

    ord: number;

    translations: LiveVoteOptionTranslation[];

    constructor({
        imageName = "",
        ord = 1,
        translations = [],
        id,
        createdAt,
        updatedAt,
    }: Partial<LiveVoteOption> = {}) {
        super(id, createdAt, updatedAt);
        this.imageName = imageName;
        this.ord = ord;
        this.translations = translations;
    }

    static createFrom(): LiveVoteOption {
        return new LiveVoteOption({
            id: getRandomId(),
            createdAt: getUTCDate(),
        });
    }
}
