import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { ConferenceApi } from "../../apis";
import { PConferenceTag } from "./ConferenceTag";

export class Conference extends BaseEntity {
    title: string;

    translations?: any;

    description: string;

    imageName: string;

    isVisible: boolean;

    startAt?: string;

    container: string;

    sessionDates: { [key: string]: { start: string; end: string } };

    conferenceTags: PConferenceTag[];

    isLive: boolean;

    isArchive: boolean;

    exhibitors: string[];

    constructor({
        title = "",
        sessionDates = {},
        container = "",
        imageName = "",
        startAt = "",
        conferenceTags = [],
        translations,
        isVisible = true,
        isLive = true,
        isArchive = true,
        description = "",
        exhibitors = [],
        id,
        createdAt,
        updatedAt,
    }: Partial<Conference> = {}) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.conferenceTags = conferenceTags;
        this.title = title;
        this.sessionDates = sessionDates;
        this.startAt = startAt;
        this.translations = translations;
        this.imageName = imageName;
        this.isVisible = isVisible;
        this.isArchive = isArchive;
        this.isLive = isLive;
        this.description = description;
        this.exhibitors = exhibitors;
    }

    toString(): string {
        return ConferenceApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            title: this.title,
            imageName: this.imageName,
            isVisible: this.isVisible,
            description: this.description,
        };
    }
}

export type PConference = Partial<Conference>;
