import {
    ExhibitorTranslation,
    SExhibitorTranslation,
} from "./ExhibitorTranslation";
import { Session } from "./Session";
import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { Container } from "./Container";
import { User } from "./User";
import { Conference } from "./Conference";
import { STREAM_TYPE } from "../../../config";

export class Exhibitor extends BaseEntity {
    translations: ExhibitorTranslation[] | SExhibitorTranslation;

    logoImageName: string;

    coverImageName: string;

    isVisible: boolean;

    isCommentEnable: boolean;

    isExternal: boolean;

    externalUrl: string;

    isEnableOnlineAttendee: boolean;

    email: string;

    address: string;

    facebook: string;

    linkedin: string;

    twitter: string;

    streamUrl: string;

    streamType: string;

    // @TODO: Add ExhibitorCategory as second type
    category: string;

    members: string[] | User[];

    sessions: string[] | Session[];

    conferences: string[] | Conference[];

    container: string | Container;

    ord: number;

    users: string[] | User[];

    website: string;

    phone: string;

    constructor({
        id,
        createdAt,
        updatedAt,
        translations = [],
        logoImageName = "",
        coverImageName = "",
        isVisible = true,
        isCommentEnable = true,
        isExternal = false,
        externalUrl = "",
        isEnableOnlineAttendee = true,
        email = "",
        address = "",
        facebook = "",
        linkedin = "",
        twitter = "",
        streamUrl = "",
        streamType = STREAM_TYPE.STREAMTYPE_YOUTUBE,
        category = "",
        ord = 1,
        website = "",
        phone = "",
        members = [],
        sessions = [],
        conferences = [],
        users = [],
        container = "",
    }: PExhibitor = {}) {
        super(id, createdAt, updatedAt);
        this.translations = translations;
        this.logoImageName = logoImageName;
        this.coverImageName = coverImageName;
        this.isVisible = isVisible;
        this.isCommentEnable = isCommentEnable;
        this.isExternal = isExternal;
        this.externalUrl = externalUrl;
        this.isEnableOnlineAttendee = isEnableOnlineAttendee;
        this.email = email;
        this.address = address;
        this.facebook = facebook;
        this.linkedin = linkedin;
        this.twitter = twitter;
        this.streamUrl = streamUrl;
        this.streamType = streamType;
        this.category = category;
        this.members = members;
        this.sessions = sessions;
        this.conferences = conferences;
        this.container = container;
        this.ord = ord;
        this.users = users;
        this.website = website;
        this.phone = phone;
    }
}

export type PExhibitor = Partial<Exhibitor>;
