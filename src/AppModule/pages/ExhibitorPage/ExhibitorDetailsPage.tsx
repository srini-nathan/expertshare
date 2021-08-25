import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { AppLoader, AppQuestionsAndAnswers } from "../../components";
import { Exhibitor, PExhibitor } from "../../../AdminModule/models";
import { ExhibitorApi } from "../../../AdminModule/apis";
import { errorToast } from "../../utils";
import { useAuthState, useSessionSocketEvents } from "../../hooks";
import "./assets/scss/style.scss";
import { ExhibitorCommentsAPI } from "../../apis";

export const ExhibitorDetailsPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [loading, isLoading] = useState<boolean>(true);
    const { containerResourceId, containerId } = useAuthState();
    const [data, setData] = useState<Exhibitor>(
        new Exhibitor(containerResourceId)
    );
    const { emitLeaveSession, emitJoinSession } = useSessionSocketEvents();

    useEffect(() => {
        isLoading(true);
        ExhibitorApi.getExhibitor<Exhibitor>({
            id,
        }).then(({ response, isNotFound, errorMessage }) => {
            if (errorMessage) {
                errorToast(errorMessage);
            } else if (isNotFound) {
                errorToast("Exhibitor not exist");
            } else if (response !== null) {
                if (response.items[0]) {
                    const res: Exhibitor = (response.items as PExhibitor[])[0] as Exhibitor;
                    setData(res);
                }
            }
            isLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (id) {
            emitJoinSession(id);
        }
        return () => {
            if (id) {
                emitLeaveSession(id);
            }
        };
    }, [id]);

    if (loading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <Row className="m-0">
                <Col
                    className={
                        data.isCommentEnable
                            ? "pl-0 pr-0 pr-lg-3 comment-enable"
                            : "px-0"
                    }
                    md={12}
                    sm={12}
                    lg={data.isCommentEnable ? 8 : 12}
                ></Col>
                {data.isCommentEnable && (
                    <Col md={12} sm={12} lg={4} className="pr-0 pl-0 pl-lg-3">
                        {data.isCommentEnable ? (
                            <AppQuestionsAndAnswers
                                name={t(
                                    "sessionDetails:section.questionAndAnswers"
                                )}
                                parentId={id}
                                socketParentId={`exhibitor_${id}`}
                                container={containerId}
                                commentsAPI={ExhibitorCommentsAPI}
                                parentElement="/api/exhibitor_comments"
                                mainElement="api/exhibitors"
                            />
                        ) : null}
                    </Col>
                )}
            </Row>
        </Fragment>
    );
};
