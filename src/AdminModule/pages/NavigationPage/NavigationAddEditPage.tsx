import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { find as _find } from "lodash";
import { useRecoilState } from "recoil";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppFormInput,
    AppFormSwitch,
    AppFormSelect,
} from "../../../AppModule/components";
import {
    errorToast,
    getRandomId,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { useNavigator } from "../../../AppModule/hooks";
import { useGlobalData } from "../../../AppModule/contexts";
import {
    Container,
    InfoPage,
    Language,
    Navigation,
    NavigationTranslations,
    NavigationType,
} from "../../models";
import { ContainerApi, InfoPageApi } from "../../apis";
import {
    AppFormTitleTranslatable,
    AppFormTitleTranslatableType,
} from "../../components/AppFormTitleTranslatable";
import { schema } from "./schema";
import { PrimitiveObject } from "../../../AppModule/models";
import { appContainerNavigation } from "../../../AppModule/atoms";
import {
    getInfoPagesLinksOptions,
    getInternalLinksOptions,
    getTypeOptions,
} from "./navigation-helper";

export const NavigationAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { key = null } = useParams();
    const isEditMode: boolean = key !== null;
    const navigator = useNavigator(navigate);
    const { languages, container, defaultLanguage } = useGlobalData();
    const [data, setData] = useState<Navigation>(new Navigation());
    const [loading, setLoading] = useState<boolean>(true);
    const [type, setType] = useState<string>(NavigationType.INTERNAL);
    const [translations, setTranslations] = useState<
        AppFormTitleTranslatableType[]
    >([]);
    const { t } = useTranslation();
    const [navigation, setNavigation] = useRecoilState<Navigation[]>(
        appContainerNavigation
    );
    const [infoPages, setInfoPages] = useState<InfoPage[]>([]);
    const [ipLoading, setIpLoading] = useState<boolean>(true);

    const {
        handleSubmit,
        trigger,
        formState,
        control,
        setValue,
    } = useForm<Navigation>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const getTranslation = (): NavigationTranslations[] => {
        let defaultValues: AppFormTitleTranslatableType = {
            locale: (defaultLanguage as Language).locale,
            title: "",
        };
        translations.forEach((e) => {
            if (e.locale === (defaultLanguage as Language).locale) {
                defaultValues = e;
            }
        });
        const collection = translations.map((e) => {
            if (e.title === "")
                return {
                    ...defaultValues,
                    locale: e.locale,
                };
            return e;
        });
        return collection as NavigationTranslations[];
    };

    const options = getTypeOptions(t);

    const checkTranslation = () => {
        let noErrorTitle = false;
        translations.forEach((e) => {
            if (!noErrorTitle) noErrorTitle = e.title !== "";
        });
        return noErrorTitle;
    };

    const onSubmit = async (formData: Navigation) => {
        if (checkTranslation() && container) {
            const othersNavs: Navigation[] =
                navigation?.filter((n) => n.key !== key) || [];
            formData.translations = getTranslation();
            if (!isEditMode) {
                formData.key = `nav-${getRandomId()}`;
            } else {
                formData.key = data.key;
            }
            const finalCollection = [formData];
            if (othersNavs) {
                finalCollection.push(...othersNavs);
            }
            return ContainerApi.update<Container, any>(container.id, {
                navigation: finalCollection,
            }).then(({ response, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (response !== null) {
                    // @TODO: missing translations
                    successToast("Navigation updated successfully");
                    setNavigation(finalCollection);
                }
                navigator("..").catch();
            });
        }
        return Promise.reject();
    };

    useEffect(() => {
        if (languages && languages.length !== translations.length) {
            const items: AppFormTitleTranslatableType[] = languages.map((e) => {
                let item = {
                    locale: e.locale,
                    title: "",
                };
                translations.forEach((k) => {
                    if (k.locale === e.locale) {
                        item = {
                            locale: k.locale,
                            title: k.title,
                        };
                    }
                });
                return item;
            });
            setTranslations(items);
        }
        if (!isEditMode) {
            setLoading(false);
        }
    }, [languages, isEditMode]);

    useEffect(() => {
        if (isEditMode) {
            const nav = navigation?.find((n) => n.key === key);
            if (nav) {
                setData(nav);
                const items: NavigationTranslations[] = [];
                Object.entries(nav.translations).forEach(([, value]) => {
                    items.push({
                        locale: value.locale,
                        title: value.title,
                    });
                });
                setTranslations(items);
                setType(nav.type);
            } else {
                // @TODO: missing translations
                errorToast("Navigation not exist");
            }
            setLoading(false);
            trigger();
        }
    }, [isEditMode, trigger, navigation]);

    useEffect(() => {
        InfoPageApi.find<InfoPage>(1, {
            "container.id": container?.id,
        }).then(({ response }) => {
            if (response?.items) {
                setInfoPages(response.items);
            }
            setIpLoading(false);
        });
    }, []);
    if (loading || ipLoading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:navigation")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.navigation.form:header.title.edit")
                        : t("admin.navigation.form:header.title.add")
                }
            />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <AppFormTitleTranslatable
                                languages={languages}
                                defaultLanguage={
                                    (defaultLanguage as Language).locale
                                }
                                translations={translations}
                                onChange={setTranslations}
                            />
                            <Form.Row>
                                <AppFormInput
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                    name={"ord"}
                                    label={t("admin.navigation.form:label.ord")}
                                    {...validation(
                                        "ord",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.ord?.message}
                                    defaultValue={`${data.ord}`}
                                    control={control}
                                />
                                <AppFormInput
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                    name={"icon"}
                                    label={t(
                                        "admin.navigation.form:label.icon"
                                    )}
                                    {...validation(
                                        "icon",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.icon?.message}
                                    defaultValue={data.icon}
                                    control={control}
                                />
                            </Form.Row>
                            <Form.Row>
                                <AppFormSelect
                                    id={"type"}
                                    name={"type"}
                                    label={t(
                                        "admin.navigation.form:label.type"
                                    )}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                    className="rm-container"
                                    required={true}
                                    {...validation("type", formState, true)}
                                    placeholder={"type"}
                                    defaultValue={data.type}
                                    errorMessage={errors.type?.message}
                                    options={options}
                                    control={control}
                                    transform={{
                                        output: (template: PrimitiveObject) => {
                                            if (template && template.value) {
                                                setType(
                                                    template.value as string
                                                );
                                                setValue("url", "");
                                            }
                                            return template?.value;
                                        },
                                        input: (value: string) => {
                                            return _find(options, {
                                                value,
                                            });
                                        },
                                    }}
                                />
                                {type === NavigationType.EXTERNAL ? (
                                    <AppFormInput
                                        sm={12}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        name={"url"}
                                        placeholder={t(
                                            "admin.navigation.form:select.placeholder.enterurl"
                                        )}
                                        label={t(
                                            "admin.navigation.form:label.url"
                                        )}
                                        {...validation(
                                            "url",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.url?.message}
                                        defaultValue={data.url}
                                        control={control}
                                    />
                                ) : null}
                                {type === NavigationType.INTERNAL ? (
                                    <AppFormSelect
                                        id={"url"}
                                        name={"url"}
                                        label={t(
                                            "admin.navigation.form:label.internalpage"
                                        )}
                                        sm={12}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        className="rm-container"
                                        required={true}
                                        {...validation("url", formState, true)}
                                        placeholder={t(
                                            "admin.navigation.form:select.placeholder.internalpage"
                                        )}
                                        defaultValue={data.url}
                                        errorMessage={errors.url?.message}
                                        options={getInternalLinksOptions(t)}
                                        control={control}
                                        transform={{
                                            output: (
                                                template: PrimitiveObject
                                            ) => template?.value,
                                            input: (value: string) => {
                                                return _find(
                                                    getInternalLinksOptions(t),
                                                    {
                                                        value,
                                                    }
                                                );
                                            },
                                        }}
                                    />
                                ) : null}
                                {type === NavigationType.INFO_PAGE ? (
                                    <AppFormSelect
                                        id={"url"}
                                        name={"url"}
                                        label={t(
                                            "admin.navigation.form:label.infopage"
                                        )}
                                        sm={12}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        className="rm-container"
                                        required={true}
                                        {...validation("url", formState, true)}
                                        placeholder={t(
                                            "admin.navigation.form:select.placeholder.infopage"
                                        )}
                                        defaultValue={data.url}
                                        errorMessage={errors.url?.message}
                                        options={getInfoPagesLinksOptions(
                                            infoPages
                                        )}
                                        control={control}
                                        transform={{
                                            output: (
                                                template: PrimitiveObject
                                            ) => template?.value,
                                            input: (value: string) => {
                                                return _find(
                                                    getInfoPagesLinksOptions(
                                                        infoPages
                                                    ),
                                                    {
                                                        value,
                                                    }
                                                );
                                            },
                                        }}
                                    />
                                ) : null}
                            </Form.Row>
                            <Form.Row>
                                <AppFormSwitch
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                    name={"isOpenInNewWindow"}
                                    label={t(
                                        "admin.navigation.form:label.isOpenInNewWindow"
                                    )}
                                    {...validation(
                                        "isOpenInNewWindow",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.isOpenInNewWindow?.message
                                    }
                                    defaultChecked={data.isOpenInNewWindow}
                                    control={control}
                                />
                                <AppFormSwitch
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                    name={"isActive"}
                                    label={t(
                                        "admin.navigation.form:label.isActive"
                                    )}
                                    {...validation(
                                        "isActive",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isActive?.message}
                                    defaultChecked={data.isActive}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>
                        <Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                backLink={".."}
                                isLoading={formState.isSubmitting}
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
