import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
// import { Col, Row } from "react-bootstrap";
// import { useForm } from "react-hook-form";
import { AppTranslation } from "../../containers/AppTranslation";

export const KitchenSinkDani: FC<RouteComponentProps> = (): JSX.Element => {
    // const { control } = useForm();

    return (
        <Fragment>
            <AppTranslation
                groupName={"group1"}
                activeLanguages={[
                    { name: "english", key: "en" },
                    { name: "germany", key: "de" },
                    { name: "french", key: "fr" },
                    { name: "italian", key: "it" },
                ]}
            />
        </Fragment>
    );
};
