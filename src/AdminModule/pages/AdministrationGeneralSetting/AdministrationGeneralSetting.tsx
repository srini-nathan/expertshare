import React, { FC, Fragment, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    AppPageHeader,
    AppCard,
    AppTabs,
    AppTab,
    AppFormElementGenerator,
} from "../../../AppModule/components";
import { AuthContext } from "../../../AppModule/Authentication/context/AuthContext";
import { ContainerApi } from "../../apis";
import { ContainerConfiguration } from "../../models";
import { errorToast } from "../../../AppModule/utils";
import { sweetSuccess } from "../../../AppModule/components/Util";

const parseData = (data: ContainerConfiguration) => {
    const items: any = [];
    Object.keys(data).forEach((key) => {
        const objects: any = [];
        Object.keys(data[key]).forEach((subkey) => {
            objects.push({
                title: subkey,
                items: data[key][subkey],
            });
        });
        items.push({
            title: key,
            fields: objects,
        });
    });
    return items;
};
const validationSchema = Yup.object().shape({});

export class ContainerEntity {
    configuration?: ContainerFormTyle;

    constructor() {
        this.configuration = {};
    }
}
export interface ContainerRequestData {
    configuration?: ContainerFormTyle;
}

export interface ContainerFormTyle {
    [key: string]: string | boolean;
}

export const AdministrationGeneralSetting: FC<RouteComponentProps> = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { cntid } = state;
    const [configuration, setConfiguration] = React.useState<any>();
    const [containerConfiguration, setContainerConfiguration] = React.useState<
        string[]
    >();
    const [activeTab, setActiveTab] = React.useState<string>("");

    const { control, handleSubmit, formState } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const buildContainer = (data: ContainerFormTyle): ContainerRequestData => {
        return { configuration: data };
    };
    const onSubmit = async (formData: ContainerFormTyle) => {
        await ContainerApi.update<ContainerEntity, ContainerRequestData>(
            cntid,
            buildContainer(formData)
        );
        await sweetSuccess({ text: "Client updated successfully " });
    };

    useEffect(() => {
        if (cntid) {
            ContainerApi.getConfigiration<ContainerConfiguration>(cntid).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        setContainerConfiguration(
                            response.items[0].configuration
                        );
                        setConfiguration(parseData(response.items[1]));
                    }
                }
            );
        }
    }, []);

    const renderTabs = () => {
        return (
            configuration &&
            configuration.map((e: any) => {
                if (activeTab === "") setActiveTab(`${e.title}_key`);
                return (
                    <AppTab eventKey={`${e.title}_key`} title={e.title}>
                        <Col md={12} className="p-0 mt-4">
                            <AppCard>
                                <Row>
                                    {e.fields &&
                                        e.fields.map((j: any) => {
                                            let defaultValue = "";
                                            if (
                                                containerConfiguration &&
                                                j.title in
                                                    containerConfiguration
                                            )
                                                defaultValue =
                                                    containerConfiguration[
                                                        j.title
                                                    ];
                                            return (
                                                <AppFormElementGenerator
                                                    properties={j}
                                                    defaultValue={defaultValue}
                                                    control={control}
                                                />
                                            );
                                        })}
                                </Row>
                            </AppCard>
                        </Col>
                    </AppTab>
                );
            })
        );
    };
    return (
        <Fragment>
            <AppPageHeader title={"Administration"} />
            <Row className="pb-5">
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <AppTabs onSelect={setActiveTab} activeKey={activeTab}>
                        {renderTabs()}
                    </AppTabs>
                    <div className="edit-client-footer-wrap p-0 w-100 ">
                        <div className="edit-client-footer py-4 w-100 d-flex flex-column flex-sm-row align-items-center justify-content-end">
                            <button
                                type="submit"
                                disabled={formState.isSubmitting}
                                className="btn btn-primary col-auto ml-3 mr-2"
                            >
                                {formState.isSubmitting && (
                                    <span className="spinner-border spinner-border-sm mr-1" />
                                )}
                                Save
                            </button>
                        </div>
                    </div>
                </Form>
            </Row>
        </Fragment>
    );
};
