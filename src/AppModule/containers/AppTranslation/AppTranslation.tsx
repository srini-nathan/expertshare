import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { isString as _isString } from "lodash";
import { useTranslation } from "react-i18next";
import {
    AppIcon,
    AppButton,
    AppFormInput,
    AppFormTextArea,
    AppModal,
} from "../../components";
import "./assets/scss/style.scss";
import {
    TranslationGroup,
    Translation,
    Language,
    TranslationValue,
} from "../../../AdminModule/models";
import {
    TranslationGroupApi,
    TranslationValueApi,
    ContainerApi,
    TranslationApi,
} from "../../../AdminModule/apis";
import { errorToast, successToast, randomInteger } from "../../utils";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";

export interface AppTranslationProps {
    activeLanguages: Language[];
    translationGroup?: TranslationGroup;
    items?: any;
}

export interface ActiveLanguages {
    name: string;
    locale: string;
    container?: string;
    val?: string;
}

export interface Items {
    id: number | undefined;
    tKey: string;
}

export const AppTranslation: FC<AppTranslationProps> = ({
    activeLanguages,
    translationGroup,
    items,
}) => {
    const { control } = useForm();
    const [translation, setTransalations] = useState<Translation[] | undefined>(
        items
    );
    const [translationGroupName, setTranslationGroup] = useState<
        TranslationGroup | undefined | null
    >(translationGroup);
    const { state } = React.useContext(AuthContext);
    const { containerId } = state as AuthState;
    const [show, isShow] = useState<boolean>(false);
    const [indexItem, setIndex] = useState<number>(0);
    const [showItem, isShowItem] = useState<boolean>(false);
    const [storing, isStoring] = useState<boolean>(false);
    const { t } = useTranslation();

    const addNewItem = () => {
        if (translation)
            setTransalations([
                {
                    id: null,
                    defaultValue: "",
                    tKey: "",
                    itemKey: randomInteger(),
                    translationGroupId: translationGroupName?.id,
                    translationGroup: translationGroupName?.tgKey
                        ? translationGroupName?.tgKey
                        : "",
                },
                ...translation,
            ]);
        else
            setTransalations([
                {
                    id: null,
                    defaultValue: "",
                    tKey: "",
                    itemKey: randomInteger(),
                    translationGroupId: translationGroupName?.id,
                    translationGroup: translationGroupName?.tgKey
                        ? translationGroupName?.tgKey
                        : "",
                },
            ]);
    };

    const removeTranslation = () => {
        const id = translation && translation[indexItem].id;
        isShowItem(false);
        if (id === null && translation) {
            setTransalations([
                ...translation.splice(0, indexItem),
                ...translation.splice(indexItem + 1),
            ]);
        } else
            TranslationApi.deleteById(id as number).then(({ error }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else {
                    successToast("Successfully deleted");
                    const newTranslations = translation?.filter(
                        (e) => e.id !== id
                    );
                    setTransalations(newTranslations);
                }
            });
    };

    const removeTranslationGroup = () => {
        isShow(false);

        if (translationGroupName === undefined) {
            setTranslationGroup(null);
            successToast("Successfully deleted");
        } else if (translationGroupName) {
            const id = translationGroupName.id ? translationGroupName.id : 0;
            TranslationGroupApi.deleteById(id).then(({ error }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else {
                    successToast("Successfully deleted");
                    setTranslationGroup(null);
                }
            });
        }
    };

    const handleGroupName = async (name: string) => {
        const data: TranslationGroup = {
            name,
            tgKey: name,
        };
        const id =
            translationGroupName && translationGroupName.id
                ? translationGroupName.id
                : null;
        TranslationGroupApi.createOrUpdate<TranslationGroup>(id, data).then(
            ({ error, errorMessage, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    } else {
                        errorToast(errorMessage);
                    }
                } else if (response !== null) {
                    setTranslationGroup(response);
                }
            }
        );
    };

    const handleDefaultValue = (
        value: string,
        index: number,
        name: "tKey" | "defaultValue"
    ) => {
        isStoring(true);
        if (translationGroupName) {
            let id = translation && translation[index].id;
            if (id === undefined) id = null;
            let data: Translation = {
                translationGroup: TranslationGroupApi.toResourceUrl(
                    translationGroupName.id ? translationGroupName.id : 0
                ),
            };
            if (name === "tKey")
                data = {
                    ...data,
                    tKey: value,
                };
            else
                data = {
                    ...data,
                    defaultValue: value,
                };
            TranslationApi.createOrUpdate<Translation>(
                id,
                data as Translation
            ).then(({ error, errorMessage, response }) => {
                isStoring(false);

                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    } else {
                        errorToast(errorMessage);
                    }
                } else if (response !== null) {
                    const translationItems = translation;
                    if (translationItems) {
                        translationItems[index] = {
                            ...translationItems[index],
                            id: response.id,
                            tKey: response.tKey,
                        };
                    }

                    setTransalations(translationItems);
                }
            });
        }
    };

    const handleTranslationValue = (
        val: string,
        locale: string,
        index: number,
        id: number | null
    ) => {
        let valueId = id;
        isStoring(true);
        if (!valueId) {
            if (translation && translation[index].items) {
                const item = translation[index].items.filter(
                    (e: any) => e.locale === locale
                );
                if (item && item.length > 0) valueId = item[0].id;
            }
        }
        let translationId = 0;
        if (
            translation &&
            translation[index].id &&
            translation[index].id !== null &&
            translation[index].id !== undefined
        )
            translationId = translation[index].id as number;

        const data: TranslationValue = {
            val,
            locale,
            translation: TranslationApi.toResourceUrl(translationId),
            container: ContainerApi.toResourceUrl(containerId as number),
        };
        TranslationValueApi.createOrUpdate<TranslationValue>(
            valueId,
            data
        ).then(({ error, errorMessage, response }) => {
            isStoring(false);

            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                } else {
                    errorToast(errorMessage);
                }
            } else if (response !== null) {
                const translationItems = translation;
                if (translationItems) {
                    const temp = translationItems[index].items
                        ? translationItems[index].items
                        : [];
                    translationItems[index] = {
                        ...translationItems[index],
                        items: [
                            ...temp,
                            {
                                id: response.id,
                                locale,
                            },
                        ],
                    };
                }

                setTransalations(translationItems);
            }
        });
    };

    const renderLanguagesHeader = () => {
        return (
            activeLanguages &&
            activeLanguages.map((e) => {
                return (
                    <div
                        key={e.locale}
                        className="value-col--inner--header--item"
                    >
                        <label>{e.name}</label>
                    </div>
                );
            })
        );
    };

    const renderLanguages = () => {
        return (
            translation &&
            translation.map((item: any, i: number) => {
                return (
                    <div
                        key={`${item.itemKey}_value`}
                        className="content--item d-flex"
                    >
                        {activeLanguages.map((e: any) => {
                            let defaultValue = "";
                            let id: number | null = null;
                            const defVal =
                                item.translationValues &&
                                item.translationValues.filter((val: any) => {
                                    return val.locale === e.locale;
                                });
                            if (defVal && defVal.length > 0) {
                                id = defVal[0].id;
                                defaultValue = defVal[0].val;
                            }

                            return (
                                <div
                                    key={`${item.tKey}_${e.locale}`}
                                    className="content--item--key"
                                >
                                    <AppFormTextArea
                                        name={`value_${e.locale}_${item.itemKey}`}
                                        placeholder={e.name.toUpperCase()}
                                        onBlurHandler={(
                                            value: React.FocusEvent<HTMLTextAreaElement>
                                        ) => {
                                            handleTranslationValue(
                                                value.target.value,
                                                e.locale,
                                                i,
                                                id
                                            );
                                        }}
                                        md={12}
                                        sm={12}
                                        lg={12}
                                        xl={12}
                                        defaultValue={defaultValue}
                                        className="input-txarea w-100 m-0 p-0"
                                        control={control}
                                    />
                                    <i className={`${e.locale} flag`}></i>
                                </div>
                            );
                        })}
                    </div>
                );
            })
        );
    };

    const renderItemsKey = () => {
        return (
            translation &&
            translation.map((item: any, i: number) => {
                return (
                    <div
                        key={`${item.itemKey}_key`}
                        className="content--item d-flex"
                    >
                        <div className="content--item--delete">
                            <AppButton
                                onClick={() => {
                                    isShowItem(true);
                                    setIndex(i);
                                }}
                                variant="secondary"
                            >
                                <AppIcon name="delete" />
                            </AppButton>
                        </div>
                        <div className="content--item--value w-100">
                            <div className="row m-0 p-0">
                                <div className="content--item--value--key col-6 px-1">
                                    <AppFormTextArea
                                        name={`translation_key_${item.itemKey}`}
                                        onBlurHandler={(
                                            value: React.FocusEvent<HTMLTextAreaElement>
                                        ) => {
                                            handleDefaultValue(
                                                value.target.value,
                                                i,
                                                "tKey"
                                            );
                                        }}
                                        placeholder={t(
                                            "admin.translation:column.translationKey"
                                        )}
                                        md={12}
                                        sm={12}
                                        lg={12}
                                        xl={12}
                                        defaultValue={item.tKey}
                                        className="input-txarea w-100 m-0 p-0"
                                        control={control}
                                    />
                                </div>
                                <div className="content--item--value--name col-6 px-1">
                                    <AppFormTextArea
                                        name={`translation_default_value_${item.itemKey}`}
                                        placeholder={t(
                                            "admin.translation:column.defaultValue"
                                        )}
                                        onBlurHandler={(
                                            value: React.FocusEvent<HTMLTextAreaElement>
                                        ) => {
                                            handleDefaultValue(
                                                value.target.value,
                                                i,
                                                "defaultValue"
                                            );
                                        }}
                                        md={12}
                                        sm={12}
                                        lg={12}
                                        xl={12}
                                        className="input-txarea w-100 m-0 p-0"
                                        defaultValue={item.defaultValue}
                                        control={control}
                                    />
                                    <i className="fak fa-check-circle-regular"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    };
    const handleHideModal = () => {
        isShow(false);
        isShowItem(false);
    };

    if (translationGroupName === null) return <></>;

    return (
        <React.Fragment>
            <AppModal
                show={show}
                handleClose={handleHideModal}
                handleDelete={removeTranslationGroup}
                bodyContent={t(
                    "admin.translation:delete.group.confirmatio.message"
                )}
            />
            <AppModal
                show={showItem}
                handleClose={handleHideModal}
                handleDelete={removeTranslation}
                bodyContent={t(
                    "admin.translation:delete.key.confirmation.message"
                )}
            />
            <div className="translation-super-admin--container col-12 mt-4 px-0">
                <div className="translation-super-admin--container--inner">
                    <div className="row p-0 m-0">
                        <div className="group-col col-8 col-sm-7 col-md-6 col-xl-5 px-0">
                            <div className="group-col--header">
                                <div className="group-col--header--offset"></div>
                                <div className="group-col--header--value w-100">
                                    <div className="row m-0 p-0">
                                        <div className="group-col--header--value--item col-6 px-1">
                                            <label>
                                                {t(
                                                    "admin.translation:column.translationKey"
                                                )}
                                            </label>
                                        </div>
                                        <div className="group-col--header--value--item col-6 px-1">
                                            <label>
                                                {t(
                                                    "admin.translation:column.defaultValue"
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="group-col--item">
                                <div className="group-col--item--container">
                                    <div className="header d-flex">
                                        <div className="header--delete pl-0 pr-1">
                                            <AppButton
                                                onClick={() => {
                                                    isShow(true);
                                                }}
                                                variant="secondary"
                                            >
                                                <AppIcon name="delete" />
                                            </AppButton>
                                        </div>
                                        <div className="header--add px-1">
                                            <AppButton
                                                onClick={addNewItem}
                                                variant="secondary"
                                                disabled={
                                                    !translationGroupName ||
                                                    storing
                                                }
                                            >
                                                <AppIcon name="add" />
                                            </AppButton>
                                        </div>
                                        <div className="header--name w-100 pl-1 pr-2">
                                            <AppFormInput
                                                md={12}
                                                sm={12}
                                                lg={12}
                                                xl={12}
                                                control={control}
                                                className="m-0 p-0"
                                                name="GroupName"
                                                placeholder={t(
                                                    "admin.translation:column.groupName"
                                                )}
                                                defaultValue={
                                                    translationGroupName
                                                        ? translationGroupName.tgKey
                                                        : ""
                                                }
                                                onBlurHandler={(
                                                    value: React.FocusEvent<HTMLInputElement>
                                                ) => {
                                                    handleGroupName(
                                                        value.target.value
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="content">
                                        {renderItemsKey()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {activeLanguages && activeLanguages.length > 0 && (
                            <div className="value-col col-4 col-sm-5 col-md-6 col-xl-7 px-0 value-carousel">
                                <div className="value-col--inner">
                                    <div className="value-col--inner--header d-flex">
                                        {renderLanguagesHeader()}
                                    </div>

                                    <div className="value-col--inner--value">
                                        <div className="header"></div>
                                        <div className="content">
                                            {renderLanguages()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
