import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { SessionApi } from "../../apis";
import { PSessionTag } from "./SessionTag";
import { PSessionCategory } from "./SessionCategory";
import { User } from "./User";
import { UserGroup } from "./UserGroup";

export class Session extends BaseEntity {
    title: string;

    translations?: any;

    description: string;

    start: string;

    end: string;

    currentTime: string;

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

    isLive: boolean;

    isArchive: boolean;

    isReply: boolean;

    isSessionPublic: boolean;

    isExternalLinkEnable: boolean;

    isShowInVideoLibrary: boolean;

    isSessionAutoSwitch: boolean;

    container: string;

    ord?: number;

    sessionTags: PSessionTag[];

    speakers: string[] | User[];

    userGroups: string[] | UserGroup[];

    moderators: string[] | User[];

    constructor({
        title = "",
        container = "",
        cardSize = "MEDIUM",
        cardType = "COMPACT",
        imageName = "",
        currentTime = "",
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
        userGroups = [],
        speakers = [],
        moderators = [],
        conference = "",
        end = "",
        streamUrl = "",
        start = "",
        sessionTags = [],
        translations,
        isCommentEnable = false,
        isArchive = false,
        isReply = false,
        isLive = false,
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
        this.currentTime = currentTime;
        this.userGroups = userGroups;
        this.userGroups = userGroups;
        this.isReply = isReply;
        this.isLive = isLive;
        this.isArchive = isArchive;
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
            currentTime: this.currentTime,
            isVisible: this.isVisible,
            isReply: this.isReply,
            isLive: this.isLive,
            isArchive: this.isArchive,
            description: this.description,
            ord: this.ord,
            userGroups: this.userGroups,
            container: this.container,
            webexMeetingPassword: this.webexMeetingPassword,
            speakers: this.speakers,
            moderators: this.moderators,
            sessionDocs: this.sessionDocs,
            webexUrl: this.webexUrl,
            cardSize: this.cardSize,
            cardType: this.cardType,
            zoomMeetingPassword: this.zoomMeetingPassword,
            zoomMeetingNumber: this.zoomMeetingNumber,
            zoomUrl: this.zoomUrl,
            streamUrl: this.streamUrl,
            streamType: this.streamType,
            isSessionAutoSwitch: this.isSessionAutoSwitch,
            isShowInVideoLibrary: this.isShowInVideoLibrary,
            externalLinkUrl: this.externalLinkUrl,
            externalLinkLabel: this.externalLinkLabel,
            isExternalLinkEnable: this.isExternalLinkEnable,
            isSessionPublic: this.isSessionPublic,
            isJoinRequired: this.isJoinRequired,
            isLikeEnable: this.isLikeEnable,
            isSharingEnable: this.isSharingEnable,
            isCommentModerated: this.isCommentModerated,
            isCommentEnable: this.isCommentEnable,
            sessionCategory: this.sessionCategory,
            sessionTags: this.sessionTags,
            conference: this.conference,
            start: this.start,
            translations: this.translations,
        };
    }
}

export type PSession = Partial<Session>;
