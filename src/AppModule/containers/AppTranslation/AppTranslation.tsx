import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isString as _isString } from "lodash";
import {
    AppIcon,
    AppButton,
    AppFormInput,
    AppFormTextArea,
    // AppModal,
    // AppLoader,
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
    TranslationApi,
} from "../../../AdminModule/apis";
import { errorToast, successToast } from "../../utils";
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
    const [languages, setLanguages] = useState<Translation[] | undefined>(
        items
    );
    const [translationGroupName, setTranslationGroup] = useState<
        TranslationGroup | undefined
    >(translationGroup);
    const [, isLoading] = useState<boolean>(false);
    const { state } = React.useContext(AuthContext);
    const { containerId } = state as AuthState;

    useEffect(() => {
        // LanguageApi.find<Language>(1, { "container.id": containerId }).then(
        //     ({ error, response }) => {
        //         if (error !== null) {
        //             if (_isString(error)) {
        //                 errorToast(error);
        //             }
        //         } else if (response !== null) {
        //             /* eslint-disable no-console */
        //             setLanguages(response.items);
        //             /* eslint-enable no-console */
        //         }
        //     }
        // );
        /* eslint-disable no-console */
        console.log(translationGroupName);
        /* eslint-enable no-console */
    }, [translationGroupName]);

    const addNewItem = () => {
        if (languages)
            setLanguages([
                ...languages,
                {
                    id: -1,
                    tKey: "",
                    translationGroupId: translationGroupName?.id,
                    translationGroup: translationGroupName?.tgKey
                        ? translationGroupName?.tgKey
                        : "",
                },
            ]);
        else
            setLanguages([
                {
                    id: -1,
                    tKey: "",
                    translationGroupId: translationGroupName?.id,
                    translationGroup: translationGroupName?.tgKey
                        ? translationGroupName?.tgKey
                        : "",
                },
            ]);

        /* eslint-disable no-console */
        console.log(languages);
        /* eslint-enable no-console */
    };

    const removeTranslation = (id: number) => {
        TranslationApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
            }
        });
    };

    // const removeItem = (index: number) => {
    //     const newItems = languages.filter((item, i) => {
    //         return i !== index;
    //     });

    //     setLanguages(newItems);
    // };

    const handleGroupName = async (name: string) => {
        isLoading(true);
        const data: TranslationGroup = {
            name,
            tgKey: name,
        };
        TranslationGroupApi.create<TranslationGroup, TranslationGroup>(
            data
        ).then(({ error, errorMessage, response }) => {
            isLoading(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                } else {
                    errorToast(errorMessage);
                }
            } else if (response !== null) {
                setTranslationGroup(response);
                /* eslint-disable no-console */
                console.log(response, translationGroup);
                /* eslint-enable no-console */
            }
        });
        // await successToast("Configuration updated successfully");
    };

    const handleDefaultValue = (value: string, index: number) => {
        /* eslint-disable no-console */
        console.log(translationGroupName, value);
        /* eslint-enable no-console */
        if (translationGroupName) {
            isLoading(true);
            const data: Translation = {
                tKey: value,
                translationGroup: `/api/translation_groups/${translationGroupName.id}`,
            };
            TranslationApi.create<Translation, Translation>(data).then(
                ({ error, errorMessage, response }) => {
                    isLoading(false);
                    if (error !== null) {
                        if (_isString(error)) {
                            errorToast(error);
                        } else {
                            errorToast(errorMessage);
                        }
                    } else if (response !== null) {
                        /* eslint-disable no-console */
                        console.log(response);
                        /* eslint-enable no-console */
                        const translationItems = languages;
                        if (translationItems)
                            translationItems[index] = {
                                ...translationItems[index],
                                id: response.id,
                                tKey: response.tKey,
                            };
                        setLanguages(translationItems);
                    }
                }
            );
        }
    };

    const handleTranslationValue = (
        val: string,
        locale: string,
        translationId: number
    ) => {
        isLoading(true);
        const data: TranslationValue = {
            val,
            locale,
            translation: `/api/translations/${translationId}`,
            container: `/api/containers/${containerId}`,
        };
        TranslationValueApi.create<TranslationValue, TranslationValue>(
            data
        ).then(({ error, errorMessage, response }) => {
            isLoading(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                } else {
                    errorToast(errorMessage);
                }
            } else if (response !== null) {
                /* eslint-disable no-console */
                console.log(response);
                /* eslint-enable no-console */
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
            languages &&
            languages.map((item: any, i: number) => {
                return (
                    <div className="content--item d-flex">
                        {activeLanguages.map((e: any, j: number) => {
                            let defaultValue = "";
                            const defVal =
                                item.translationValues &&
                                item.translationValues.filter((val: any) => {
                                    return val.locale === e.locale;
                                });
                            if (defVal && defVal.length > 0)
                                defaultValue = defVal[0].val;

                            return (
                                <div
                                    key={e.locale}
                                    className="content--item--key"
                                >
                                    <AppFormTextArea
                                        name={`item_key_${e.locale}_${j}`}
                                        placeholder={e.name.toUpperCase()}
                                        onBlurHandler={(
                                            value: React.FocusEvent<HTMLTextAreaElement>
                                        ) => {
                                            handleTranslationValue(
                                                value.target.value,
                                                e.locale,
                                                item.id
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
            languages &&
            languages.map((item: any, i: number) => {
                return (
                    <div className="content--item d-flex">
                        <div className="content--item--delete">
                            <AppButton
                                onClick={() => removeTranslation(item.id)}
                                variant="secondary"
                            >
                                <AppIcon name="delete" />
                            </AppButton>
                        </div>
                        <div className="content--item--value w-100">
                            <div className="row m-0 p-0">
                                <div className="content--item--value--key col-6 px-1">
                                    <AppFormTextArea
                                        name={`item_key_${i}`}
                                        onBlurHandler={(
                                            value: React.FocusEvent<HTMLTextAreaElement>
                                        ) => {
                                            handleDefaultValue(
                                                value.target.value,
                                                i
                                            );
                                        }}
                                        placeholder="Item Key"
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
                                        name={`item_key_`}
                                        placeholder="Default Value"
                                        md={12}
                                        sm={12}
                                        lg={12}
                                        xl={12}
                                        className="input-txarea w-100 m-0 p-0"
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

    return (
        <React.Fragment>
            {/* {
                <AppModal
                show={show}
                handleClose={handleNegative}
                handleDelete={handlePositive}
                bodyContent={confirmation}
            />
            } */}
            <div className="translation-super-admin--container col-12 mt-4 px-0">
                {/* {loading && (
                    <div className="translation-loading">
                        <AppLoader />
                    </div>
                )} */}
                <div className="translation-super-admin--container--inner">
                    <div className="row p-0 m-0">
                        <div className="group-col col-8 col-sm-7 col-md-6 col-xl-5 px-0">
                            <div className="group-col--header">
                                <div className="group-col--header--offset"></div>
                                <div className="group-col--header--value w-100">
                                    <div className="row m-0 p-0">
                                        <div className="group-col--header--value--item col-6 px-1">
                                            <label>Translation Key</label>
                                        </div>
                                        <div className="group-col--header--value--item col-6 px-1">
                                            <label>Default Value</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="group-col--item">
                                <div className="group-col--item--container">
                                    <div className="header d-flex">
                                        <div className="header--delete pl-0 pr-1">
                                            <AppButton
                                                disabled={!translationGroupName}
                                                variant="secondary"
                                            >
                                                <AppIcon name="delete" />
                                            </AppButton>
                                        </div>
                                        <div className="header--add px-1">
                                            <AppButton
                                                onClick={addNewItem}
                                                variant="secondary"
                                                disabled={!translationGroupName}
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
                                                defaultValue={
                                                    translationGroupName &&
                                                    translationGroupName.tgKey
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
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
