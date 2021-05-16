import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { isString as _isString } from "lodash";
import { AppPageHeader } from "../../../AppModule/components";
import { AppTranslation } from "../../../AppModule/containers/AppTranslation";
import { LanguageApi, TranslationApi } from "../../apis";
import { Language, TranslationGroup } from "../../models";
import { TranslationCombine } from "../../models/entities/TranslationCombine";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";
import { errorToast } from "../../../AppModule/utils";

export interface TranslationCombineList {
    translationGroup?: TranslationGroup | undefined;
    items?: TranslationCombine[] | undefined;
}

export const TranslationAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const [translataionCombines, setTranslationCombines] = useState<
        TranslationCombineList[]
    >([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const { state } = React.useContext(AuthContext);
    const { containerId } = state as AuthState;

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
    }, [containerId]);

    useEffect(() => {
        TranslationApi.find<TranslationCombine>(1).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    /* eslint-disable no-console */
                    console.log(response);
                    /* eslint-enable no-console */
                    const groups: TranslationCombineList[] = [];
                    let groupName: TranslationGroup;
                    let groupItem: any = [];
                    response.items.forEach((e) => {
                        if (
                            groupName &&
                            groupName.tgKey === e.translationGroup.tgKey
                        )
                            groupItem.push({
                                tKey: e.tKey,
                                id: e.id,
                                translationValues: e.translationValues,
                            });
                        else {
                            if (groupName)
                                groups.push({
                                    translationGroup: groupName,
                                    items: groupItem,
                                });
                            groupName = e.translationGroup;
                            groupItem = [
                                {
                                    tKey: e.tKey,
                                    id: e.id,
                                    translationValues: e.translationValues,
                                },
                            ];
                        }
                    });
                    setTranslationCombines(groups);
                }
            }
        );
    }, [languages]);
    const renderTranslations = () => {
        return (
            translataionCombines &&
            translataionCombines.map((e, i) => {
                return (
                    <AppTranslation
                        key={i}
                        translationGroup={e.translationGroup}
                        items={e.items}
                        activeLanguages={languages}
                    />
                );
            })
        );
    };

    return (
        <>
            <AppPageHeader customToolbar title={"Administration"}>
                <div className="d-flex justify-content-end">
                    <button
                        onClick={() =>
                            setTranslationCombines([
                                ...translataionCombines,
                                {
                                    translationGroup: undefined,
                                    items: undefined,
                                },
                            ])
                        }
                        className="btn btn-secondary"
                    >
                        New Group Key
                    </button>
                </div>
            </AppPageHeader>
            {renderTranslations()}
        </>
    );
};
