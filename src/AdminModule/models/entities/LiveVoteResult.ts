import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { LiveVoteQuestion } from "./LiveVoteQuestion";
import { User } from "./User";

export class LiveVoteResult extends BaseEntity {
    voteQuestion: string | LiveVoteQuestion;

    user: string | User;

    result: string;

    constructor(
        voteQuestion: string | LiveVoteQuestion,
        user: string | User,
        result: string,
        { id, createdAt, updatedAt }: Partial<LiveVoteResult> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.voteQuestion = voteQuestion;
        this.user = user;
        this.result = result;
    }
}

export type PLiveVoteResult = Partial<LiveVoteResult>;
