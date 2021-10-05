import { BaseEntity } from "./BaseEntity";
import { MEETING_PROVIDER, MEETING_TYPE } from "../../../config";
import { Client } from "../../../AdminModule/models/entities/Client";
import { User } from "../../../AdminModule/models/entities/User";
import { MeetingApi } from "../../apis/MeetingApi";

export interface Duration {
    hours: number;
    minutes: number;
    id: number;
}

export interface Availability {
    day: number;
    start: string;
    end: string;
    id: number;
}

export interface DbAvailability {
    day: number;
    start: string;
    end: string;
}

export class Meeting extends BaseEntity {
    name: string;

    provider: string;

    providerUrl: string;

    description: string;

    type: string;

    duration: string[] | Duration[];

    availability: DbAvailability[];

    startDate: string | Date;

    endDate: string | Date;

    repeatWeek: number;

    noticePeriod: number;

    bufferPeriod: number;

    isActive: boolean;

    isSendReminder: boolean;

    isBookOnce: boolean;

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
            duration = [`45`],
            availability = [{ day: 1, start: "10:00", end: "11:00" }],
            startDate = "",
            endDate = "",
            repeatWeek = 1,
            noticePeriod = 5,
            bufferPeriod = 5,
            isActive = true,
            isSendReminder = true,
            isBookOnce = false,
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
        this.isBookOnce = isBookOnce;
    }

    toString(): string {
        return MeetingApi.toResourceUrl(this.id);
    }
}

export type PMeeting = Partial<Meeting>;
