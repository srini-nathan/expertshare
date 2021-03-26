import React, { FC, Fragment, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col } from "react-bootstrap";
import { AppGrid } from "../../../AppModule/containers/AppGrid";
import { AppPageHeader } from "../../../AppModule/components/AppPageHeader";
import { AppListPageToolbar } from "../../../AppModule/components/AppListPageToolbar";
import { LanguageApi } from "../../apis/LanguageApi";

export const LanguageListPage: FC<RouteComponentProps> = (): JSX.Element => {
    useEffect(() => {
        LanguageApi.findAll().then(() => {});
    }, []);

    return (
        <Fragment>
            <AppPageHeader title={"Language"} />
            <AppListPageToolbar
                createLabel={"Create Language"}
                createLink={"languages/new"}
            />
            <Row>
                <Col>
                    <AppGrid
                        data={[
                            { make: "Toyota", model: "Celica", price: 35000 },
                            { make: "Ford", model: "Mondeo", price: 32000 },
                            { make: "Porsche", model: "Boxter", price: 72000 },
                        ]}
                    />
                </Col>
            </Row>
        </Fragment>
    );
};
