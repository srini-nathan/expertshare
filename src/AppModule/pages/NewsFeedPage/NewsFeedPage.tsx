import React, { FC, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col } from "react-bootstrap";

import { AppFeedAdder, AppFeedShower } from "../../components";

import { NewsfeedApi } from "../../apis";
// import { errorToast } from "../../utils";

export const NewsFeedPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [newsFeedData, setNewsfeedData] = useState<any>([]);

    // eslint-disable-next-line no-console
    console.log(newsFeedData);
    const container = 1;

    const updateFeed = () => {
        NewsfeedApi.getNewsfeed(container).then((response) => {
            if (response) {
                setNewsfeedData(response["hydra:member"].reverse());
            }
        });
    };

    return (
        <>
            <Row className="justify-content-md-center">
                <Col md={11}>
                    <h1>Feed</h1>
                    <AppFeedAdder
                        isSend
                        handleUpdateFeed={() => updateFeed()}
                        className="app-feed-adder"
                        container={1}
                    />
                </Col>

                <Col md={11}>
                    <AppFeedShower />
                </Col>
            </Row>
        </>
    );
};
