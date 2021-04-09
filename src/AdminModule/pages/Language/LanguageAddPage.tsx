import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col } from "react-bootstrap";
import { AppPageHeader } from "../../../AppModule/components/AppPageHeader";
import { AppBreadcrumb } from "../../../AppModule/components/AppBreadcrumb";
import { AppDatePicker, AppFormDropdown } from "../../../AppModule/components";

export const LanguageAddPage: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <Fragment>
            <AppBreadcrumb linkText={"Language"} linkUrl={".."} />
            <AppPageHeader title={"New Language"} />
            <Row>
                <Col>
                    <AppFormDropdown id={"example"} value={1} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <AppDatePicker value={new Date()} onChange={() => {}} />
                </Col>
            </Row>
        </Fragment>
    );
};
