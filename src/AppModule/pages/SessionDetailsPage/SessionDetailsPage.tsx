import React, { FC } from "react";
import { useParams, RouteComponentProps } from "@reach/router";
import { AppQuestionsAndAnswers } from "../../components";

export const SessionDetailsPage: FC<RouteComponentProps> = (): JSX.Element => {
    // const [loading, isLoading] = useState<boolean>(true);
    const { id, number } = useParams();
    const container = 2;

    return (
        <>
            <AppQuestionsAndAnswers
                name="Questions & Answers"
                conferenceNumber={id}
                session={number}
                container={container}
            />
        </>
    );
};
