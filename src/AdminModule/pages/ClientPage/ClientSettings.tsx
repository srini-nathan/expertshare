import React, { FC, Fragment, useEffect } from "react";
import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
    AppPageHeader,
    AppCard,
    AppLoader,
    AppTabs,
    AppTab,
    AppFormElementGenerator,
    AppFormActions,
    AppButton,
    AppBreadcrumb,
} from "../../../AppModule/components";
import { AppContext } from "../../../AppModule/contexts/AppContext";
import { ClientApi } from "../../apis";
import { successToast, errorToast } from "../../../AppModule/utils";
import { ContainerTypes } from "../../../AppModule/contexts";
import { Container, Language } from "../../models";
import { useLanguages } from "../../../AppModule/hooks";

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

interface ContainerRequestData {
    configuration?: ClientFormType;
    storage?: string;
}

interface ClientFormType {
    [key: string]: string | boolean | any[];
}

export const ClientSettings: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { state, dispatch } = React.useContext(AppContext);

    const { clientId } = useParams();
    const { isLoading } = state;
    const [configuration, setConfiguration] = React.useState<any>();
    const [loadingData, isLoadingData] = React.useState<boolean>(false);
    const [active, setActive] = React.useState<string>("");
    const [clientConfiguration, setClientConfiguration] = React.useState<any>();
    const [activeTab, setActiveTab] = React.useState<string>("");

    const { Languages } = useLanguages();
    const { t } = useTranslation();

    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const buildContainer = (data: ClientFormType): ContainerRequestData => {
        return { configuration: data, storage: "Local" };
    };

    const onSubmit = async (formData: ClientFormType) => {
        let client = 0;
        if (clientId) client = clientId;

        isLoadingData(true);
        await ClientApi.update<Container, ContainerRequestData>(
            client,
            buildContainer(formData)
        ).then(({ response, isNotFound, errorMessage }) => {
            if (errorMessage) {
                errorToast(errorMessage);
            } else if (isNotFound) {
                errorToast("Container not exist");
            } else if (response !== null) {
                nav("/reloading", {
                    state: {
                        url: window.location.pathname,
                    },
                });
                successToast("Configuration updated successfully");
            }
            isLoadingData(false);
        });
    };

    useEffect(() => {
        if (clientId) {
            dispatch({
                type: ContainerTypes.LOADING,
            });
            ClientApi.findById<Container>(clientId).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        setClientConfiguration(response.configuration);
                        setConfiguration(
                            parseData(response.configurationTypes)
                        );

                        dispatch({
                            type: ContainerTypes.SUCCESS,
                            payload: response,
                        });
                    }
                }
            );
        }
    }, [clientId]);

    const renderTabs = () => {
        if (configuration?.length > 0 && activeTab === "")
            setActiveTab(`${configuration[0].title}_key`);

        return (
            configuration &&
            configuration.map((e: any) => {
                return (
                    <AppTab eventKey={`${e.title}_key`} title={t(e.title)}>
                        <Col md={12} className="p-0 mt-4">
                            <AppCard>
                                <Row>
                                    {e.title ===
                                        "configuration.container.tab:content" && (
                                        <Col
                                            md={12}
                                            className="d-flex mb-4 tabs-translation"
                                        >
                                            {Languages().map(
                                                (lang: Language, i: number) => {
                                                    return (
                                                        <AppButton
                                                            className={`mr-2 ${
                                                                active ===
                                                                lang.locale
                                                                    ? "active"
                                                                    : ""
                                                            } ${lang.locale}`}
                                                            onClick={() => {
                                                                setActive(
                                                                    lang.locale
                                                                );
                                                            }}
                                                            variant="secondary"
                                                            key={i}
                                                        >
                                                            <i></i>
                                                            {lang.name}
                                                        </AppButton>
                                                    );
                                                }
                                            )}
                                        </Col>
                                    )}

                                    {e.fields &&
                                        e.fields.map((j: any) => {
                                            let defaultValue = "";
                                            if (
                                                clientConfiguration &&
                                                j.title in clientConfiguration
                                            ) {
                                                defaultValue =
                                                    clientConfiguration[
                                                        j.title
                                                    ];
                                            }

                                            return (
                                                <AppFormElementGenerator
                                                    activeLanguage={active}
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
            <AppBreadcrumb
                linkText={t("common.breadcrumb:clients")}
                linkUrl={"../.."}
            />
            <AppPageHeader
                title={t("admin.client.setting.form:header.title")}
            />
            {isLoading || loadingData ? (
                <AppLoader />
            ) : (
                <Row className="pb-5 m-0">
                    <Form
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-100"
                    >
                        <AppTabs onSelect={setActiveTab} activeKey={activeTab}>
                            {renderTabs()}
                        </AppTabs>
                        <Row>
                            <AppFormActions
                                isEditMode={true}
                                navigation={nav}
                                backLink="../.."
                            />
                        </Row>
                    </Form>
                </Row>
            )}
        </Fragment>
    );
};
