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
    AppTabs,
    AppTab,
    AppFormElementGenerator,
    AppFormActions,
} from "../../../AppModule/components";
import { AppContext } from "../../../AppModule/Contexts/AppContext";
import { ContainerApi } from "../../apis";
import { successToast } from "../../../AppModule/utils";

const parseData = (data: any) => {
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

class ContainerEntity {
    configuration?: ContainerFormType;

    constructor() {
        this.configuration = {};
    }
}
interface ContainerRequestData {
    configuration?: ContainerFormType;
}

interface ContainerFormType {
    [key: string]: string | boolean;
}

export const AdministrationGeneralSetting: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    // @TODO: instead of use from context use API to fetch data
    const { state } = React.useContext(AppContext);
    const { isLoading, ContainerState } = state;
    const [configuration, setConfiguration] = React.useState<any>();
    const [containerConfiguration, setContainerConfiguration] = React.useState<
        string[]
    >();
    const [activeTab, setActiveTab] = React.useState<string>("");
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const buildContainer = (data: ContainerFormType): ContainerRequestData => {
        return { configuration: data };
    };
    const onSubmit = async (formData: ContainerFormType) => {
        await ContainerApi.update<ContainerEntity, ContainerRequestData>(
            ContainerState.id,
            buildContainer(formData)
        );
        await successToast("Configuration updated successfully ");
    };
    // @TODO: Add different Api to get types
    useEffect(() => {
        if (!isLoading && ContainerState) {
            setContainerConfiguration(ContainerState.configuration);
            setConfiguration(parseData(ContainerState.configurationTypes));
        }
    }, [ContainerState]);

    const renderTabs = () => {
        if (configuration?.length > 0 && activeTab === "")
            setActiveTab(`${configuration[0].title}_key`);

        return (
            configuration &&
            configuration.map((e: any) => {
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
            {isLoading ? (
                <AppLoader />
            ) : (
                <Row className="pb-5">
                    <Form
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-100"
                    >
                        <AppTabs onSelect={setActiveTab} activeKey={activeTab}>
                            {renderTabs()}
                        </AppTabs>
                        <AppFormActions isEditMode={true} navigation={nav} />
                    </Form>
                </Row>
            )}
        </Fragment>
    );
};
