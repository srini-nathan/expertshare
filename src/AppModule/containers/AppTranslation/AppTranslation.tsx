import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    AppIcon,
    AppButton,
    AppFormInput,
    AppTextArea,
} from "../../components";
import "./assets/scss/style.scss";

export interface AppTranslationProps {
    activeLanguages: ActiveLanguages[];
    groupName: string;
}

export interface ActiveLanguages {
    name: string;
    key: string;
    value?: string;
}

export interface Items {
    itemKey: string;
    itemDefaultValue: string;
    itemLanguages: ActiveLanguages[];
}

export const AppTranslation: FC<AppTranslationProps> = ({
    activeLanguages = [{ name: "english", key: "en" }],
    groupName,
}) => {
    const { control } = useForm();
    const [languages, setLanguages] = useState<Items[]>([]);

    const addNewItem = () => {
        const activeLangs: ActiveLanguages[] = [];
        activeLanguages.forEach((e) => {
            activeLangs.push({
                name: e.name,
                key: e.key,
                value: "",
            });
        });
        setLanguages([
            ...languages,
            {
                itemKey: "",
                itemDefaultValue: "",
                itemLanguages: activeLangs,
            },
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = languages.filter((item, i) => {
            return i !== index;
        });

        setLanguages(newItems);
    };
    const handlekeyChange = (value: string, index: number, name: string) => {
        const items = languages;
        const item = { ...languages[index], [name]: value };
        items[index] = item;
        setLanguages(items);
    };
    const handleValueChange = (
        value: string,
        itemIndex: number,
        index: number
    ) => {
        const items = languages;
        items[itemIndex].itemLanguages[index].value = value;

        setLanguages(items);
    };
    useEffect(() => {}, [languages]);
    const renderLanguagesHeader = () => {
        return activeLanguages.map((e) => {
            return (
                <div key={e.key} className="value-col--inner--header--item">
                    <label>{e.name}</label>
                </div>
            );
        });
    };
    const renderLanguages = () => {
        return (
            languages &&
            languages.map((item, i) => {
                return (
                    <div className="content--item d-flex">
                        {activeLanguages.map((e, j) => {
                            return (
                                <div key={e.key} className="content--item--key">
                                    <AppTextArea
                                        name={`item_key_${e.key}_${j}`}
                                        placeholder={e.name.toUpperCase()}
                                        onChange={(value) => {
                                            handleValueChange(value, i, j);
                                        }}
                                        md={12}
                                        sm={12}
                                        lg={12}
                                        xl={12}
                                        defaultValue={e.value}
                                        className="input-txarea w-100 m-0 p-0"
                                    />
                                    <i className={`${e.key} flag`}></i>
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
            languages.map((item, i) => {
                return (
                    <div className="content--item d-flex">
                        <div className="content--item--delete">
                            <AppButton
                                onClick={() => removeItem(i)}
                                variant="secondary"
                            >
                                <AppIcon name="delete" />
                            </AppButton>
                        </div>
                        <div className="content--item--value w-100">
                            <div className="row m-0 p-0">
                                <div className="content--item--value--key col-6 px-1">
                                    <AppTextArea
                                        name={`item_key_${i}`}
                                        onChange={(value) => {
                                            handlekeyChange(
                                                value,
                                                i,
                                                "itemKey"
                                            );
                                        }}
                                        placeholder="Item Key"
                                        md={12}
                                        sm={12}
                                        lg={12}
                                        xl={12}
                                        className="input-txarea w-100 m-0 p-0"
                                    />
                                </div>
                                <div className="content--item--value--name col-6 px-1">
                                    <AppTextArea
                                        name={`item_key_`}
                                        onChange={(value) =>
                                            handlekeyChange(
                                                value,
                                                i,
                                                "itemDefaultValue"
                                            )
                                        }
                                        placeholder="Default Value"
                                        md={12}
                                        sm={12}
                                        lg={12}
                                        xl={12}
                                        className="input-txarea w-100 m-0 p-0"
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
            <div className="translation-super-admin--container col-12 mt-4 px-0">
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
                                            <AppButton variant="secondary">
                                                <AppIcon name="delete" />
                                            </AppButton>
                                        </div>
                                        <div className="header--add px-1">
                                            <AppButton
                                                onClick={addNewItem}
                                                variant="secondary"
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
                                                value={groupName}
                                                name="GroupName"
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
