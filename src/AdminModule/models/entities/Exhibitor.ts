import {
    ExhibitorTranslation,
    SExhibitorTranslation,
} from "./ExhibitorTranslation";
import { Session } from "./Session";
import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { JsonResponseData } from "../../../AppModule/models";
import { Container } from "./Container";
import { User } from "./User";
import { Conference } from "./Conference";
import { STREAM_TYPE } from "../../../config";
import { ExhibitorApi } from "../../apis";

export class Exhibitor extends BaseEntity {
    translations: ExhibitorTranslation[] | SExhibitorTranslation;

    name: string;

    description: string;

    contactUsCaption: string;

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
        name = "",
        description = "",
        contactUsCaption = "",
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
        this.name = name;
        this.description = description;
        this.contactUsCaption = contactUsCaption;
    }

    toString(): string {
        return ExhibitorApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        const data: JsonResponseData = {
            ...super.toJSON(addExtraData),
            name: this.name,
            description: this.description,
            contactUsCaption: this.contactUsCaption,
            logoImageName: this.logoImageName,
            coverImageName: this.coverImageName,
            isVisible: this.isVisible,
            isCommentEnable: this.isCommentEnable,
            isExternal: this.isExternal,
            externalUrl: this.externalUrl,
            isEnableOnlineAttendee: this.isEnableOnlineAttendee,
            address: this.address,
            facebook: this.facebook,
            linkedin: this.linkedin,
            twitter: this.twitter,
            streamUrl: this.streamUrl,
            streamType: this.streamType,
            container: this.container,
            website: this.website,
            phone: this.phone,
            email: this.email,
        };

        return data;
    }
}

export type PExhibitor = Partial<Exhibitor>;

export type PRExhibitor = {
    "@id": string;
} & PExhibitor;
