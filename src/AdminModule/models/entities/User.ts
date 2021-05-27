import {
    BaseEntity,
    JsonResponseData,
    SimpleObject,
} from "../../../AppModule/models";
import { UserApi } from "../../apis";

export class User extends BaseEntity {
    email: string;

    firstName: string;

    lastName: string;

    locale: string;

    jobTitle: string;

    company: string;

    plainPassword: string;

    confirmPassword: string;

    client: string;

    role: string;

    roles: string[];

    status: string;

    userTags?: SimpleObject<string | number>[] | string[];

    userGroups?: SimpleObject<string | number>[] | string[];

    userFieldValues?: SimpleObject<string | number>[] | string[];

    constructor({
        email = "",
        plainPassword = "",
        confirmPassword = "",
        firstName = "",
        lastName = "",
        locale = "",
        company = "",
        jobTitle = "",
        client = "",
        role = "",
        status = "",
        userTags = [],
        roles = [],
        userGroups = [],
        userFieldValues = [],
        id,
        createdAt,
        updatedAt,
    }: Partial<User> = {}) {
        super(id, createdAt, updatedAt);
        this.firstName = firstName;
        this.lastName = lastName;
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
