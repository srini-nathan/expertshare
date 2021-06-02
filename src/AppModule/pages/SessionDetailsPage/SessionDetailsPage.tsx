import React, { FC } from "react";
import { useParams, RouteComponentProps } from "@reach/router";
// import { errorToast } from "../../utils";
// import { SessionAPI } from "../../apis";
import { AppQuestionsAndAnswers } from "../../components";

export const SessionDetailsPage: FC<RouteComponentProps> = (): JSX.Element => {
    // const [loading, isLoading] = useState<boolean>(true);
    const { id, number } = useParams();
    const container = 3;

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
