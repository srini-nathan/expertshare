import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col } from "react-bootstrap";
import {
    AppPageHeader,
    AppDatePicker,
    AppFormDropdown,
    AppTagSelect,
} from "../../../AppModule/components";
import { AppBreadcrumb } from "../../../AppModule/components/AppBreadcrumb";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

export const LanguageAddPage: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <Fragment>
            <AppBreadcrumb linkText={"Language"} linkUrl={".."} />
            <AppPageHeader title={"Add Language"} />
            <Row>
                <Col>
                    <AppFormDropdown
                        id={"example"}
                        value={"chocolate"}
                        options={options}
                    />
                </Col>
            </Row>
            <hr />
            <hr />
            <Row>
                <Col>
                    <AppDatePicker value={new Date()} onChange={() => {}} />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <AppTagSelect
                        options={options}
                        value={new Date()}
                        onChange={() => {}}
                        id={"tag-selector"}
                    />
                </Col>
            </Row>
        </Fragment>
    );
};
