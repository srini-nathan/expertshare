import React, { FC } from "react";

export interface AppLiveVoteQuestionType {
    title: string;
    description?: string;
}

export const AppLiveVoteQuestion: FC<AppLiveVoteQuestionType> = ({
    title,
    description,
}) => {
    return (
        <div className="question-det mt-3">
            <h3 className="question-det--title">{title}</h3>
            {description ? (
                <p className="question-det--desc mb-0">{description}</p>
            ) : null}
        </div>
    );
};
