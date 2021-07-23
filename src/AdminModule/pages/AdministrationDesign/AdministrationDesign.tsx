import React, { FC, Fragment, useEffect, useState } from "react";
import { RouteComponentProps, useNavigate } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
    AppPageHeader,
    AppCard,
    AppLoader,
    AppFormElementGenerator,
    AppFormActions,
    AppTab,
    AppButton,
    AppTabs,
    AppModal,
} from "../../../AppModule/components";
import { AppContext } from "../../../AppModule/contexts/AppContext";
import { ContainerApi } from "../../apis";
import {
    successToast,
    errorToast,
    showLoader,
    hideLoader,
} from "../../../AppModule/utils";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import { ContainerTypes } from "../../../AppModule/contexts/types/container-types";
import { Container, Language } from "../../models";
import { CONSTANTS } from "../../../config";
import { useGlobalData } from "../../../AppModule/contexts";
import { UploadAPI } from "../../../AppModule/apis";
import { Upload } from "../../../AppModule/models";
import { GenerateApi } from "../../apis/GenerateApi";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPE: { FILETYPE_DESIGN_CONFIGURATION },
} = UPLOAD;

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
    designConfiguration?: ContainerFormType;
}

interface ContainerFormType {
    [key: string]: string | boolean | any[];
}

export const AdministrationDesign: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { state, dispatch } = React.useContext(AppContext);
    const Auth = React.useContext(AuthContext);
    const { containerId } = Auth.state as AuthState;
    const { isLoading } = state;
    const [configuration, setConfiguration] = React.useState<any>();
    const [loadingData, isLoadingData] = React.useState<boolean>(false);
    const [active, setActive] = React.useState<string>("");
    const [
        containerConfiguration,
        setContainerConfiguration,
    ] = React.useState<any>();
    const [activeTab, setActiveTab] = React.useState<string>("");
    const [translations, setTranslations] = React.useState<any[]>([]);
    const [files, setFiles] = React.useState<ContainerFormType>(
        {} as ContainerFormType
    );
    const { languages, container: myContainer } = useGlobalData();
    const { t } = useTranslation();
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const { control, handleSubmit, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const buildContainer = (data: ContainerFormType): ContainerRequestData => {
        return { designConfiguration: data };
    };

    const afterSubmit = async () => {
        if (containerId) {
            await GenerateApi.getStyle(containerId).then(({ data }) => {
                const styleTag = document.createElement("style");
                styleTag.id = "dynamic-css";
                styleTag.appendChild(document.createTextNode(data));
                document.head.appendChild(styleTag);
            });
        }
    };

    const generateStyleSubmit = () => {
        showLoader(
            t("admin.designConfig.form:generateStyle.generatingLoader.message")
        ).then();
        if (myContainer) {
            ContainerApi.generateStyleRequest(myContainer.id)
                .then(() => {
                    hideLoader();
                    successToast(
                        t("admin.designConfig.form:generateStyle.toast.success")
                    );
                })
                .catch(() => {
                    hideLoader();
                    errorToast(
                        t("admin.designConfig.form:generateStyle.toast.error")
                    );
                });
        }
    };

    const onSubmit = async (formData: ContainerFormType) => {
        let container = 0;
        if (containerId) container = containerId;
        const newFormData: ContainerFormType = {
            ...formData,
            ...files,
        };
        isLoadingData(true);
        await ContainerApi.update<Container, ContainerRequestData>(
            container,
            buildContainer(newFormData)
        ).then(({ response, isNotFound, errorMessage }) => {
            if (errorMessage) {
                errorToast(errorMessage);
            } else if (isNotFound) {
                errorToast(
                    t("admin.designConfig.form:toast.containerNotFound")
                );
            } else if (response !== null) {
                setContainerConfiguration(response.designConfiguration);
                setConfiguration(parseData(response.designConfigurationTypes));
                successToast(t("admin.designConfig.form:toast.update.success"));
            }
            isLoadingData(false);
            afterSubmit();
        });
    };

    const onDocsSelect = (
        selectedFiles: File[],
        title: string,
        translatable: boolean
    ) => {
        if (selectedFiles) {
            const fd = new FormData();
            fd.set("file", selectedFiles[0], selectedFiles[0].name);
            fd.set("fileType", FILETYPE_DESIGN_CONFIGURATION);

            UploadAPI.createResource<Upload, FormData>(fd).then(
                ({ response, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (response && response.fileName) {
                        if (!translatable) {
                            setFiles({
                                ...files,
                                [title]: response.fileName,
                            });
                        }
                    }
                }
            );
        }
    };

    useEffect(() => {
        if (containerId) {
            dispatch({
                type: ContainerTypes.LOADING,
            });
            ContainerApi.findById<Container>(containerId).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast(
                            t("admin.designConfig.form:toast.containerNotFound")
                        );
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
                                            {languages?.map(
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
                                                containerConfiguration &&
                                                j.title in
                                                    containerConfiguration
                                            ) {
                                                defaultValue =
                                                    containerConfiguration[
                                                        j.title
                                                    ];
                                            }

                                            return (
                                                <AppFormElementGenerator
                                                    translations={translations}
                                                    onChange={setTranslations}
                                                    onFileSelect={onDocsSelect}
                                                    activeLanguage={active}
                                                    properties={j}
                                                    defaultValue={defaultValue}
                                                    control={control}
                                                    setValue={setValue}
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
            <AppPageHeader title={"Design"} />
            {isLoading || loadingData ? (
                <AppLoader />
            ) : (
                <Row className="m-0">
                    <Form
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-100"
                    >
                        <AppTabs onSelect={setActiveTab} activeKey={activeTab}>
                            {renderTabs()}
                        </AppTabs>
                        <AppModal
                            show={showConfirmModal}
                            title={t(
                                "admin.designConfig.form:generateStyle.confirmation.title"
                            )}
                            handleClose={() => {
                                setShowConfirmModal(false);
                            }}
                            handleDelete={() => {
                                generateStyleSubmit();
                                setShowConfirmModal(false);
                            }}
                            bodyContent={t(
                                "admin.designConfig.form:generateStyle.confirmation.content"
                            )}
                        />
                        <Row>
                            <AppFormActions isEditMode={true} navigation={nav}>
                                <AppButton
                                    type="button"
                                    variant={"secondary"}
                                    className="mr-4"
                                    disabled={loadingData}
                                    onClick={() => {
                                        setShowConfirmModal(true);
                                    }}
                                >
                                    {t(
                                        "admin.designConfig.form:generateStyle.button"
                                    )}
                                </AppButton>
                            </AppFormActions>
                        </Row>
                    </Form>
                </Row>
            )}
        </Fragment>
    );
};
