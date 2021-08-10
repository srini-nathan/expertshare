import { LiveVoteOptionTranslation } from "./LiveVoteOptionTranslation";
import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { getRandomId, getUTCDate } from "../../../AppModule/utils";
import { SimpleObject } from "../../../AppModule/models";

export type SLiveVoteOptionTranslation = SimpleObject<LiveVoteOptionTranslation>;

export class LiveVoteOption extends BaseEntity {
    imageName: string;

    ord: number;

    translations: LiveVoteOptionTranslation[] | SLiveVoteOptionTranslation;

    val: string;

    color: string;

    constructor({
        imageName = "",
        val = "",
        color = "#00F",
        ord = 1,
        translations = [],
        id,
        createdAt,
        updatedAt,
    }: Partial<LiveVoteOption> = {}) {
        super(id, createdAt, updatedAt);
        this.imageName = imageName;
        this.val = val;
        this.color = color;
        this.ord = ord;
        this.translations = translations;
    }

    static createFrom(): LiveVoteOption {
        return new LiveVoteOption({
            id: getRandomId(),
            createdAt: getUTCDate(),
            ord: 1,
            val: "",
            imageName: "",
            color: "#00F",
        });
    }
}
