import { MEETING_BOOKING_STATUS } from "../../../config";
import { BaseEntity } from "./BaseEntity";
import { Meeting } from "./Meeting";
import { Client, User } from "../../../AdminModule/models";
import { MeetingBookingApi } from "../../apis/MeetingBookingApi";

export class MeetingBooking extends BaseEntity {
    meetingTime: string;

    duration: number;

    meeting: string | Meeting;

    user: string | User;

    client: string | Client;

    status: string;

    constructor(
        meeting: string | Meeting,
        client: string | Client,
        user: User | string,
        {
            id,
            createdAt,
            updatedAt,
            meetingTime = "",
            status = MEETING_BOOKING_STATUS.STATUS_CREATED,
            duration = 0,
        }: PMeetingBooking = {}
    ) {
        super(id, createdAt, updatedAt);
        this.meeting = meeting;
        this.client = client;
        this.user = user;
        this.status = status;
        this.duration = duration;
        this.meetingTime = meetingTime;
    }

    toString(): string {
        return MeetingBookingApi.toResourceUrl(this.id);
    }
}

export type PMeetingBooking = Partial<MeetingBooking>;
