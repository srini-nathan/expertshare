import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { User } from "./User";
import { MEETING_PROVIDER, MEETING_TYPE } from "../../../config";
import { MeetingApi } from "../../apis";
import { Client } from "./Client";

export class Meeting extends BaseEntity {
    name: string;

    provider: string;

    providerUrl: string;

    description: string;

    type: string;

    duration: string[];

    availability: string[];

    startDate: string;

    endDate: string;

    repeatWeek: number;

    noticePeriod: number;

    bufferPeriod: number;

    isActive: boolean;

    isSendReminder: boolean;

    user: string | User;

    client: string | Client;

    constructor(
        client: string | Client,
        user: User | string,
        {
            id,
            createdAt,
            updatedAt,
            name = "",
            provider = MEETING_PROVIDER.PROVIDER_MEET,
            providerUrl = "",
            description = "",
            type = MEETING_TYPE.TYPE_SINGLE,
            duration = [],
            availability = [],
            startDate = "",
            endDate = "",
            repeatWeek = 0,
            noticePeriod = 0,
            bufferPeriod = 0,
            isActive = true,
            isSendReminder = true,
        }: PMeeting = {}
    ) {
        super(id, createdAt, updatedAt);
        this.client = client;
        this.user = user;
        this.name = name;
        this.provider = provider;
        this.providerUrl = providerUrl;
        this.description = description;
        this.type = type;
        this.duration = duration;
        this.availability = availability;
        this.startDate = startDate;
        this.endDate = endDate;
        this.repeatWeek = repeatWeek;
        this.noticePeriod = noticePeriod;
        this.bufferPeriod = bufferPeriod;
        this.isActive = isActive;
        this.isSendReminder = isSendReminder;
    }

    toString(): string {
        return MeetingApi.toResourceUrl(this.id);
    }
}

export type PMeeting = Partial<Meeting>;
