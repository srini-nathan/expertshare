import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col } from "react-bootstrap";
import { AppPageHeader } from "../../../AppModule/components/AppPageHeader";
import { AppBreadcrumb } from "../../../AppModule/components/AppBreadcrumb";

export const LanguageAddPage: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <Fragment>
            <AppBreadcrumb linkText={"Language"} linkUrl={".."} />
            <AppPageHeader title={"New Language"} />
            <Row>
                <Col></Col>
            </Row>
        </Fragment>
    );
};
