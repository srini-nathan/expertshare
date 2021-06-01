import React, { FC, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
// import { errorToast } from "../../utils";
// import { UserApi } from "../../../AdminModule/apis";
// import { AppLoader } from "../../components";
import { AppQuestionsAndAnswers } from "../../components";

export const SessionDetailsPage: FC<RouteComponentProps> = (): JSX.Element => {
    // const [user, setUser] = useState<User>();
    // const [loading, isLoading] = useState<boolean>(true);
    // const { id } = useParams();

    useEffect(() => {
        // isLoading(true);
        // UserApi.getAttendeeView<User>(id).then(({ response, error }) => {
        //     isLoading(false);
        //     if (error !== null) {
        //         if (_isString(error)) {
        //             errorToast(error);
        //         }
        //     } else if (response !== null) {
        //         setUser(response);
        //     }
        // });
    }, []);

    // if (loading) return <AppLoader />;

    return (
        <>
            <AppQuestionsAndAnswers name="Questions & Answers" />
        </>
    );
};
