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
import { AppContext } from "../../../AppModule/contexts/AppContext";
import { ContainerApi } from "../../apis";
import { successToast } from "../../../AppModule/utils";

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

export const AdministrationDesign: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { state } = React.useContext(AppContext);
    const { isLoading, ContainerState } = state;
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
        await ContainerApi.update<ContainerEntity, ContainerRequestData>(
            ContainerState.id,
            buildContainer(formData)
        );
        await successToast("Configuration updated successfully");
    };
    // @TODO: Add different Api to get types
    useEffect(() => {
        if (!isLoading && ContainerState) {
            setContainerConfiguration(ContainerState.designConfiguration);
            setConfiguration(
                parseData(ContainerState.designConfigurationTypes)
            );
        }
    }, [ContainerState]);

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
