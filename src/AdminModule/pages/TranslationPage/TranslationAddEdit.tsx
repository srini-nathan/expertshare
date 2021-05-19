import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { isString as _isString } from "lodash";
import {
    AppPageHeader,
    AppLoader,
    AppGridPagination,
    AppFormDropdown,
} from "../../../AppModule/components";
import { AppTranslation } from "../../../AppModule/containers/AppTranslation";
import { LanguageApi, TranslationApi } from "../../apis";
import { Language, TranslationGroup } from "../../models";
import { TranslationCombine } from "../../models/entities/TranslationCombine";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";
import { errorToast } from "../../../AppModule/utils";
import { defaultPageSize, pageSizeOptions } from "./app-translation-helpers";
import { AppTranslationToolbar } from "./AppTranslationToolbar";
import "./assets/scss/style.scss";

export interface TranslationCombineList {
    translationGroup?: TranslationGroup | undefined;
    itemKey?: any;
    items?: TranslationCombine[] | undefined;
}

export const TranslationAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const [pageSize] = useState<number>(30);

    const [translataionCombines, setTranslationCombines] = useState<
        TranslationCombineList[]
    >([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, isLoading] = useState<boolean>(false);
    const { state } = React.useContext(AuthContext);
    const { containerId } = state as AuthState;

    useEffect(() => {
        isLoading(true);
        LanguageApi.find<Language>(1, { "container.id": containerId }).then(
            ({ error, response }) => {
                isLoading(false);
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setLanguages(response.items);
                }
            }
        );
    }, [containerId]);

    useEffect(() => {
        isLoading(false);
    }, [translataionCombines]);

    const fetchData = (page = 1) => {
        isLoading(true);
        TranslationApi.find<TranslationCombine>(page).then(
            ({ error, response }) => {
                isLoading(false);
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    /* eslint-disable no-console */
                    console.log(response);
                    /* eslint-enable no-console */
                    let groups: TranslationCombineList[] = [];

                    response.items.forEach((e) => {
                        const index = groups.findIndex(
                            (item) =>
                                item.translationGroup &&
                                item.translationGroup.tgKey ===
                                    e.translationGroup.tgKey
                        );

                        if (index !== -1) {
                            let items: any = [];
                            if (groups[index]) items = groups[index].items;
                            groups = [
                                ...groups.slice(0, index),
                                {
                                    ...groups[index],
                                    items: [
                                        ...items,
                                        {
                                            itemKey:
                                                Math.floor(
                                                    Math.random() * 10000 + 1000
                                                ) *
                                                Math.floor(
                                                    Math.random() * 10000 + 1000
                                                ),
                                            tKey: e.tKey,
                                            defaultValue: e.defaultValue,
                                            id: e.id,
                                            translationGroup:
                                                e.translationGroup,
                                            translationValues:
                                                e.translationValues,
                                        },
                                    ],
                                },
                                ...groups.slice(index + 1),
                            ];
                        } else {
                            groups.push({
                                translationGroup: e.translationGroup,
                                itemKey:
                                    Math.floor(Math.random() * 10000 + 1000) *
                                    Math.floor(Math.random() * 10000 + 1000),
                                items: [
                                    {
                                        itemKey:
                                            Math.floor(
                                                Math.random() * 10000 + 1000
                                            ) *
                                            Math.floor(
                                                Math.random() * 10000 + 1000
                                            ),
                                        tKey: e.tKey,
                                        defaultValue: e.defaultValue,
                                        id: e.id,
                                        translationGroup: e.translationGroup,
                                        translationValues: e.translationValues,
                                    },
                                ],
                            });
                        }
                    });
                    setTranslationCombines(groups);
                    setTotalItems(response.totalItems);
                }
            }
        );
    };
    useEffect(() => {
        fetchData();
    }, [languages]);
    const renderTranslations = () => {
        return (
            translataionCombines &&
            translataionCombines.map((e) => {
                return (
                    <AppTranslation
                        key={e.itemKey}
                        translationGroup={e.translationGroup}
                        items={e.items}
                        activeLanguages={languages}
                    />
                );
            })
        );
    };

    if (loading) return <AppLoader />;

    return (
        <>
            <AppPageHeader customToolbar title={"Administration"}>
                <AppTranslationToolbar
                    onCreateNew={() => {
                        setTranslationCombines([
                            {
                                translationGroup: undefined,
                                itemKey:
                                    Math.floor(Math.random() * 10000 + 1000) *
                                    Math.floor(Math.random() * 10000 + 1000),

                                items: undefined,
                            },
                            ...translataionCombines,
                        ]);
                    }}
                />
            </AppPageHeader>
            {renderTranslations()}
            <div className="d-flex flex-row app-grid-action py-3">
                <AppGridPagination
                    className="mr-3"
                    itemsPerPage={pageSize}
                    totalItems={totalItems}
                />
                {totalItems > 0 ? (
                    <div className="pagination-container">
                        <AppFormDropdown
                            id={"pageSize"}
                            defaultValue={defaultPageSize()}
                            options={pageSizeOptions()}
                            menuPlacement={"top"}
                        />
                    </div>
                ) : null}
            </div>
        </>
    );
};
