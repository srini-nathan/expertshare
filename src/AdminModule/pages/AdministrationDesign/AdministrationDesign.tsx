import React, { FC, Fragment, useEffect } from "react";
import { RouteComponentProps, useNavigate } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    AppPageHeader,
    AppCard,
    AppLoader,
    AppFormElementGenerator,
    AppFormActions,
} from "../../../AppModule/components";
import { AppContext } from "../../../AppModule/Contexts/AppContext";
import { ContainerApi } from "../../apis";
import { successToast, errorToast } from "../../../AppModule/utils";
import { AuthContext } from "../../../SecurityModule/context/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import { ContainerTypes } from "../../../AppModule/Contexts/Types";
import { Container } from "../../models";

const parseData = (data: any) => {
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

interface ContainerRequestData {
    designConfiguration?: ContainerFormType;
}

interface ContainerFormType {
    [key: string]: string | boolean;
}

export const AdministrationDesign: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { state, dispatch } = React.useContext(AppContext);
    const Auth = React.useContext(AuthContext);
    const { containerId } = Auth.state as AuthState;
    const { isLoading } = state;
    const [configuration, setConfiguration] = React.useState<any>();
    const [containerConfiguration, setContainerConfiguration] = React.useState<
        string[]
    >();

    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const buildContainer = (data: ContainerFormType): ContainerRequestData => {
        return { designConfiguration: data };
    };
    const onSubmit = async (formData: ContainerFormType) => {
        let container = 0;
        if (containerId) container = containerId;
        dispatch({
            type: ContainerTypes.LOADING,
        });
        await ContainerApi.update<Container, ContainerRequestData>(
            container,
            buildContainer(formData)
        ).then(({ response, isNotFound, errorMessage }) => {
            if (errorMessage) {
                errorToast(errorMessage);
            } else if (isNotFound) {
                errorToast("Container not exist");
            } else if (response !== null) {
                setContainerConfiguration(response.designConfiguration);
                setConfiguration(parseData(response.designConfigurationTypes));
                dispatch({
                    type: ContainerTypes.SUCCESS,
                    payload: response,
                });
                successToast("Configuration updated successfully");
            }
        });
    };
    useEffect(() => {
        if (containerId) {
            dispatch({
                type: ContainerTypes.LOADING,
            });
            ContainerApi.getById<Container>(containerId).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        setContainerConfiguration(response.designConfiguration);
                        setConfiguration(
                            parseData(response.designConfigurationTypes)
                        );
                        dispatch({
                            type: ContainerTypes.SUCCESS,
                            payload: response,
                        });
                    }
                }
            );
        }
    }, [containerId]);

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
            {isLoading ? (
                <AppLoader />
            ) : (
                <Row>
                    <Form
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-100"
                    >
                        {renderConfigs()}
                        <AppFormActions isEditMode={true} navigation={nav} />
                    </Form>
                </Row>
            )}
        </Fragment>
    );
};
