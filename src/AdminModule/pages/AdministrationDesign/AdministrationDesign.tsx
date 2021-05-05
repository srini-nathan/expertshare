import React, { FC, Fragment, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    AppPageHeader,
    AppCard,
    AppFormElementGenerator,
} from "../../../AppModule/components";
import { AuthContext } from "../../../AppModule/Authentication/context/AuthContext";
import { ContainerApi } from "../../apis";
import { Container, ContainerConfiguration } from "../../models";
import { sweetSuccess } from "../../../AppModule/components/Util";

const parseData = (data: ContainerConfiguration) => {
    const items: any = [];
    Object.keys(data).forEach((key) => {
        Object.keys(data[key]).forEach((subkey) => {
            items.push({
                title: subkey,
                items: data[key][subkey],
            });
        });
    });
    return items;
};
const validationSchema = Yup.object().shape({});

class ContainerEntity {
    designConfiguration?: ContainerFormType;

    constructor() {
        this.designConfiguration = {};
    }
}
interface ContainerRequestData {
    designConfiguration?: ContainerFormType;
}

interface ContainerFormType {
    [key: string]: string | boolean;
}

export const AdministrationDesign: FC<RouteComponentProps> = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { cntid } = state;
    const [configuration, setConfiguration] = React.useState<any>();
    const [containerConfiguration, setContainerConfiguration] = React.useState<
        string[]
    >();

    const { control, handleSubmit, formState } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const buildContainer = (data: ContainerFormType): ContainerRequestData => {
        return { designConfiguration: data };
    };
    const onSubmit = async (formData: ContainerFormType) => {
        await ContainerApi.update<ContainerEntity, ContainerRequestData>(
            cntid,
            buildContainer(formData)
        );
        await sweetSuccess({ text: "Client updated successfully " });
    };

    useEffect(() => {
        if (cntid) {
            ContainerApi.findById<Container>(cntid).then((res) => {
                setContainerConfiguration(res.designConfiguration);
                setConfiguration(parseData(res.designConfigurationTypes));
            });
        }
    }, []);

    const renderConfigs = () => {
        return (
            <Col md={12} className="p-0">
                <AppCard>
                    <Row>
                        {configuration &&
                            configuration.map((j: any) => {
                                let defaultValue = "";
                                if (
                                    containerConfiguration &&
                                    j.title in containerConfiguration
                                )
                                    defaultValue =
                                        containerConfiguration[j.title];
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
        );
    };
    return (
        <Fragment>
            <AppPageHeader title={"Design"} />
            <Row>
                <Form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-100"
                >
                    {renderConfigs()}
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
