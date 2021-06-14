import {
    BaseEntity,
    JsonResponseData,
    SimpleObject,
} from "../../../AppModule/models";
import { UserApi } from "../../apis";

export class User extends BaseEntity {
    email: string;

    source: string;

    firstName: string;

    lastName: string;

    locale: string;

    imageName: string;

    jobTitle: string;

    company: string;

    plainPassword: string;

    confirmPassword: string;

    client: string;

    role: string;

    isOnboarded: boolean;

    isDisplayAsGuest: boolean;

    isExposeEmail: boolean;

    isAllowCommunication: boolean;

    timezone: string;

    relationManager: string;

    roles: string[];

    status: string;

    onboardedAt?: string;

    lastLoginAt?: string;

    isBlocked: boolean;

    userTags?: SimpleObject<string | number>[] | string[];

    userGroups?: SimpleObject<string | number>[] | string[];

    userFieldValues?: SimpleObject<string | number>[] | string[];

    userField?: SimpleObject<any>[];

    constructor({
        email = "",
        plainPassword = "",
        confirmPassword = "",
        imageName = "",
        relationManager = "",
        firstName = "",
        lastName = "",
        source = "",
        lastLoginAt = "",
        onboardedAt = "",
        timezone = "",
        locale = "",
        company = "",
        jobTitle = "",
        client = "",
        role = "",
        status = "",
        userTags = [],
        isBlocked = false,
        isOnboarded = false,
        isDisplayAsGuest = false,
        isExposeEmail = false,
        isAllowCommunication = false,
        roles = [],
        userGroups = [],
        userFieldValues = [],
        userField = [],
        id,
        createdAt,
        updatedAt,
    }: Partial<User> = {}) {
        super(id, createdAt, updatedAt);
        this.source = source;
        this.relationManager = relationManager;
        this.firstName = firstName;
        this.lastName = lastName;
        this.timezone = timezone;
        this.userField = userField;
        this.isBlocked = isBlocked;
        this.onboardedAt = onboardedAt;
        this.imageName = imageName;
        this.lastLoginAt = lastLoginAt;
        this.isOnboarded = isOnboarded;
        this.isAllowCommunication = isAllowCommunication;
        this.isExposeEmail = isExposeEmail;
        this.isDisplayAsGuest = isDisplayAsGuest;
        this.locale = locale;
        this.jobTitle = jobTitle;
        this.client = client;
        this.role = role;
        this.roles = roles;
        this.plainPassword = plainPassword;
        this.status = status;
        this.userTags = userTags;
        this.userFieldValues = userFieldValues;
        this.email = email;
        this.company = company;
        this.confirmPassword = confirmPassword;
        this.userGroups = userGroups;
    }

    toString(): string {
        return UserApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        const data: JsonResponseData = {
            ...super.toJSON(addExtraData),
            email: this.email,
            plainPassword: this.plainPassword,
            confirmPassword: this.confirmPassword,
            imageName: this.imageName,
            relationManager: this.relationManager,
            firstName: this.firstName,
            lastName: this.lastName,
            source: this.source,
            lastLoginAt: this.lastLoginAt,
            onboardedAt: this.onboardedAt,
            timezone: this.timezone,
            locale: this.locale,
            company: this.company,
            jobTitle: this.jobTitle,
            client: this.client,
            role: this.role,
            status: this.status,
            userTags: this.userTags,
            isBlocked: this.isBlocked,
            isOnboarded: this.isOnboarded,
            isDisplayAsGuest: this.isDisplayAsGuest,
            isExposeEmail: this.isExposeEmail,
            isAllowCommunication: this.isAllowCommunication,
            roles: this.roles,
            userGroups: this.userGroups,
            userFieldValues: this.userFieldValues,
            userField: this.userField,
        };

        return data;
    }
}

export type PUser = Partial<User>;
