import React, { FC, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col } from "react-bootstrap";
import { AppFeedAdder, AppFeedShower } from "../../components";
import { useAuthState } from "../../hooks";
import { successToast } from "../../utils";

import { NewsfeedApi } from "../../apis";

export const NewsFeedPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { containerId, user } = useAuthState();

    const [newsFeedData, setNewsfeedData] = useState<any>([]);

    const updateFeed = () => {
        NewsfeedApi.getNewsfeed(containerId).then((response) => {
            setNewsfeedData([]);
            if (response) {
                // eslint-disable-next-line no-console
                console.log(response);
                setNewsfeedData(response["hydra:member"].reverse());
            }
        });
    };

    const deleteNewsFeedById = (id: number) => {
        NewsfeedApi.deleteNewsfeedById(id).then(() => {
            setNewsfeedData([]);
            updateFeed();
            successToast("Successfully deleted");
        });
    };

    useEffect(() => {
        updateFeed();
    }, []);

    return (
        <>
            <Row className="justify-content-md-center">
                <Col md={11}>
                    <h1>Feed</h1>
                    <AppFeedAdder
                        isSend
                        handleUpdateFeed={() => updateFeed()}
                        className="app-feed-adder"
                        container={containerId}
                    />
                </Col>

                <Col md={11}>
                    {newsFeedData.length > 0 &&
                        newsFeedData.map((item: any, index: number) => (
                            <AppFeedShower
                                user={user}
                                handleNewsFeedId={deleteNewsFeedById}
                                key={index}
                                item={item}
                                container={containerId}
                            ></AppFeedShower>
                        ))}
                </Col>
            </Row>
        </>
    );
};
