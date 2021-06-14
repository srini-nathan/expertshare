import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { SessionApi } from "../../apis";
import { PSessionTag } from "./SessionTag";
import { PSessionCategory } from "./SessionCategory";
import { User } from "./User";

export class Session extends BaseEntity {
    title: string;

    translations?: any;

    description: string;

    start: string;

    end: string;

    sessionDocs: {
        fileName: string;
        name: string;
        container: string;
    }[];

    sessionCategory: string | PSessionCategory;

    cardSize: string;

    cardType: string;

    conference: string;

    streamType: string;

    zoomUrl: string;

    zoomMeetingNumber: string;

    zoomMeetingPassword: string;

    webexUrl: string;

    webexMeetingPassword: string;

    imageName: string;

    streamUrl: string;

    externalLinkLabel: string;

    externalLinkUrl: string;

    isVisible: boolean;

    isCommentEnable: boolean;

    isCommentModerated: boolean;

    isSharingEnable: boolean;

    isLikeEnable: boolean;

    isJoinRequired: boolean;

    isSessionPublic: boolean;

    isExternalLinkEnable: boolean;

    isShowInVideoLibrary: boolean;

    isSessionAutoSwitch: boolean;

    container: string;

    ord?: number;

    sessionTags: PSessionTag[];

    speakers: string[] | User[];

    moderators: string[] | User[];

    constructor({
        title = "",
        container = "",
        cardSize = "MEDIUM",
        cardType = "COMPACT",
        imageName = "",
        ord = 1,
        webexMeetingPassword = "",
        webexUrl = "",
        zoomMeetingPassword = "",
        zoomMeetingNumber = "",
        zoomUrl = "",
        streamType = "YOUTUBE",
        externalLinkUrl = "",
        externalLinkLabel = "",
        sessionCategory = "",
        sessionDocs = [],
        speakers = [],
        moderators = [],
        conference = "",
        end = "",
        streamUrl = "",
        start = "",
        sessionTags = [],
        translations,
        isCommentEnable = false,
        isCommentModerated = false,
        isSharingEnable = false,
        isLikeEnable = false,
        isJoinRequired = false,
        isSessionPublic = false,
        isExternalLinkEnable = false,
        isSessionAutoSwitch = false,
        isShowInVideoLibrary = false,
        isVisible = true,
        description = "",
        id,
        createdAt,
        updatedAt,
    }: Partial<Session> = {}) {
        super(id, createdAt, updatedAt);
        this.ord = ord;
        this.container = container;
        this.webexMeetingPassword = webexMeetingPassword;
        this.speakers = speakers;
        this.moderators = moderators;
        this.sessionDocs = sessionDocs;
        this.webexUrl = webexUrl;
        this.cardSize = cardSize;
        this.cardType = cardType;
        this.zoomMeetingPassword = zoomMeetingPassword;
        this.zoomMeetingNumber = zoomMeetingNumber;
        this.zoomUrl = zoomUrl;
        this.streamUrl = streamUrl;
        this.streamType = streamType;
        this.isSessionAutoSwitch = isSessionAutoSwitch;
        this.isShowInVideoLibrary = isShowInVideoLibrary;
        this.externalLinkUrl = externalLinkUrl;
        this.externalLinkLabel = externalLinkLabel;
        this.isExternalLinkEnable = isExternalLinkEnable;
        this.isSessionPublic = isSessionPublic;
        this.isJoinRequired = isJoinRequired;
        this.isLikeEnable = isLikeEnable;
        this.isSharingEnable = isSharingEnable;
        this.isCommentModerated = isCommentModerated;
        this.isCommentEnable = isCommentEnable;
        this.sessionCategory = sessionCategory;
        this.sessionTags = sessionTags;
        this.conference = conference;
        this.imageName = imageName;
        this.container = container;
        this.end = end;
        this.start = start;
        this.title = title;
        this.translations = translations;
        this.isVisible = isVisible;
        this.description = description;
    }

    toString(): string {
        return SessionApi.toResourceUrl(this.id);
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

export type PSession = Partial<Session>;
