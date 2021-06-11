import React, { FC, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col } from "react-bootstrap";
import { AppFeedAdder, AppFeedShower } from "../../components";
import { useAuthState } from "../../hooks";
import { successToast, errorToast } from "../../utils";

import { NewsfeedApi } from "../../apis";

export const NewsFeedPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { containerId, user } = useAuthState();

    const [newsFeedData, setNewsfeedData] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [isFetching, setIsFetching] = useState(false);

    const addNewsfeed = (message: any) => {
        setNewsfeedData([message, ...newsFeedData]);
    };

    const getFeed = () => {
        setCurrentPage(currentPage + 1);
        NewsfeedApi.getNewsfeed(containerId, currentPage).then((response) => {
            if (response) {
                setNewsfeedData([...newsFeedData, ...response["hydra:member"]]);
                setIsFetching(false);
            }
        });
    };

    const deleteNewsFeedById = (id: number) => {
        NewsfeedApi.deleteNewsfeedById(id).then(() => {
            const newNewsfeed = newsFeedData.filter(
                (item: any) => item.id !== id
            );
            setNewsfeedData(newNewsfeed);
            successToast("Successfully deleted");
        });
    };

    const patchNewsfeedMessage = (id: number, message: string) => {
        const messageToPost = JSON.stringify({
            postText: `${message}`,
        });

        NewsfeedApi.patchNewsfeed<any, any>(id, messageToPost).then(
            ({ errorMessage, response }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                }
                if (response) {
                    const obj = newsFeedData.find((x: any) => x.id === id);
                    obj.postText = message;

                    const index = newsFeedData.findIndex(
                        (mess: any) => mess.id === id
                    );
                    const newsFeed = [...newsFeedData];
                    newsFeed[index] = obj;

                    setNewsfeedData(newsFeed);
                    successToast("Successfully Updated");
                }
            }
        );
    };

    // eslint-disable-next-line no-console
    console.log(newsFeedData);

    const isScrolling = () => {
        // eslint-disable-next-line no-console
        // console.log(
        //     window.innerHeight + document.documentElement.scrollTop,
        //     document.documentElement.offsetHeight - 1
        // );
        if (
            window.innerHeight + document.documentElement.scrollTop >
            document.documentElement.offsetHeight - 1
        ) {
            setIsFetching(true);
        }
        // eslint-disable-next-line no-console
    };

    useEffect(() => {
        if (isFetching) {
            getFeed();
        }
    }, [isFetching]);

    useEffect(() => {
        getFeed();
        window.addEventListener("scroll", isScrolling);
        return () => window.removeEventListener("scroll", isScrolling);
    }, []);

    return (
        <>
            <Row className="justify-content-md-center">
                <Col md={11}>
                    <h1>Feed</h1>
                    <AppFeedAdder
                        isSend
                        addNewsfeedObject={addNewsfeed}
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
                                handlePatchNewsfeedMessage={(id, message) => {
                                    patchNewsfeedMessage(id, message);
                                }}
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
