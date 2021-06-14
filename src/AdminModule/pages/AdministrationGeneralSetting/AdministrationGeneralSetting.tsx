import React, { FC, Fragment, useEffect } from "react";
import { RouteComponentProps, useNavigate } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { isString as _isString } from "lodash";
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
} from "../../../AppModule/components";
import { AppContext } from "../../../AppModule/contexts/AppContext";
import { ContainerApi, LanguageApi } from "../../apis";
import { successToast, errorToast } from "../../../AppModule/utils";
import { AuthContext } from "../../../SecurityModule/contexts";
import { AuthState } from "../../../SecurityModule/models";
import { ContainerTypes } from "../../../AppModule/contexts";
import { Container, Language } from "../../models";
import { CONSTANTS } from "../../../config";
import { UploadAPI } from "../../../AppModule/apis";
import { Upload } from "../../../AppModule/models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPE: { FILETYPE_CONFIGURATION },
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
    configuration?: ContainerFormType;
}

interface ContainerFormType {
    [key: string]: string | boolean | any[];
}

export const AdministrationGeneralSetting: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { state, dispatch } = React.useContext(AppContext);
    const Auth = React.useContext(AuthContext);
    const { containerId } = Auth.state as AuthState;
    const { isLoading } = state;
    const [configuration, setConfiguration] = React.useState<any>();
    const [languages, setLanguages] = React.useState<Language[]>([]);
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
    const { t } = useTranslation();

    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const buildContainer = (data: ContainerFormType): ContainerRequestData => {
        return { configuration: data };
    };

    const onDocsSelect = (
        selectedFiles: File[],
        title: string,
        translatable: boolean
    ) => {
        if (selectedFiles) {
            const fd = new FormData();
            fd.set("file", selectedFiles[0], selectedFiles[0].name);
            fd.set("fileType", FILETYPE_CONFIGURATION);

            UploadAPI.createResource<Upload, FormData>(fd).then(
                ({ response, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (response && response.fileName) {
                        if (translatable) {
                            const newTranslatiosn = translations.map((e) => {
                                if ((e.locale as string) === active)
                                    return {
                                        ...e,
                                        [title]: response.fileName,
                                    };
                                return e;
                            });
                            setTranslations(newTranslatiosn);
                        } else
                            setFiles({
                                ...files,
                                [title]: response.fileName,
                            });
                    }
                }
            );
        }
        /* eslint-disable no-console */
        console.log(files);
        /* eslint-enable no-console */
    };

    const onSubmit = async (formData: ContainerFormType) => {
        let container = 0;
        if (containerId) container = containerId;
        dispatch({
            type: ContainerTypes.LOADING,
        });
        formData.translations = translations;
        const newFormData: ContainerFormType = {
            ...formData,
            ...files,
        };
        await ContainerApi.update<Container, ContainerRequestData>(
            container,
            buildContainer(newFormData)
        ).then(({ response, isNotFound, errorMessage }) => {
            if (errorMessage) {
                errorToast(errorMessage);
            } else if (isNotFound) {
                errorToast("Container not exist");
            } else if (response !== null) {
                setContainerConfiguration(response.configuration);
                setConfiguration(parseData(response.configurationTypes));

                dispatch({
                    type: ContainerTypes.SUCCESS,
                    payload: response,
                });
                successToast("Configuration updated successfully");
            }
        });
    };
    useEffect(() => {
        /* eslint-disable no-console */
        console.log(translations);
        /* eslint-enable no-console */
    }, [translations]);
    useEffect(() => {
        LanguageApi.find<Language>(1, { "container.id": containerId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setLanguages(response.items);
                }
            }
        );
    }, []);
    useEffect(() => {
        if (containerConfiguration) {
            setTranslations(containerConfiguration.translations);
        }
    }, [containerConfiguration]);
    useEffect(() => {
        if (containerId) {
            dispatch({
                type: ContainerTypes.LOADING,
            });
            ContainerApi.findById<Container>(containerId, {
                "groups[]": "translations",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Container not exist");
                } else if (response !== null) {
                    setContainerConfiguration(response.configuration);
                    setConfiguration(parseData(response.configurationTypes));

                    // const groupName = "translations";
                    // if (res[groupName]) setTranslations(res[groupName]);
                    dispatch({
                        type: ContainerTypes.SUCCESS,
                        payload: response,
                    });
                }
            });
        }
    }, [containerId]);

    useEffect(() => {
        if (active === "")
            languages.forEach((e) => {
                if (e.isDefault) {
                    setActive(e.locale);
                }
            });

        if (languages.length !== translations.length) {
            /* eslint-disable no-console */
            console.log(
                languages.length,
                translations.length,
                languages,
                translations
            );
            /* eslint-enable no-console */
            const items: any[] = languages.map((e) => {
                let item = {
                    locale: e.locale,
                };
                translations.forEach((k) => {
                    if (k.locale === e.locale) {
                        item = {
                            ...k,
                            locale: k.locale,
                        };
                    }
                });
                return item;
            });
            setTranslations(items);
        }
    }, [languages]);
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
                                            {languages
                                                .sort(
                                                    (
                                                        a: Language,
                                                        b: Language
                                                    ) =>
                                                        b.isDefault >
                                                        a.isDefault
                                                            ? 1
                                                            : -1
                                                )
                                                .map(
                                                    (
                                                        lang: Language,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <AppButton
                                                                className={`mr-2 ${
                                                                    active ===
                                                                    lang.locale
                                                                        ? "active"
                                                                        : ""
                                                                } ${
                                                                    lang.locale
                                                                }`}
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
                <Row className="pb-5 m-0">
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
