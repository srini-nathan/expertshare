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
        };

        return data;
    }
}
