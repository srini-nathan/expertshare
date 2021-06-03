import React, { FC, Fragment, useState, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { isString as _isString } from "lodash";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { LanguageApi } from "../../apis";
import { Language } from "../../models";
import { AppPageHeader, AppLoader } from "../../../AppModule/components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";
import { useAuthState, useDownloadFile } from "../../../AppModule/hooks";
import { errorToast, successToast } from "../../../AppModule/utils";
import "./assets/scss/list.scss";

export const LanguageListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(false);
    const [selectedLocale, setSelectedLocale] = useState<string>("");
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { containerId } = useAuthState();
    const [updateLink] = useDownloadFile();
    const fileInputRef = useRef<HTMLInputElement>(null);

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                LanguageApi.find<Language>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        "container.id": containerId,
                    },
                    (c) => {
                        cancelTokenSourcesRef.current.push(c);
                    }
                ).then(({ error, response }) => {
                    if (error !== null) {
                        if (_isString(error)) {
                            errorToast(error);
                        }
                    } else if (response !== null) {
                        if (response.items.length === 0) {
                            api?.showNoRowsOverlay();
                        }
                        setTotalItems(response.totalItems);
                        params.successCallback(
                            response.items,
                            response.totalItems
                        );
                    }
                });
            },
        };
    }

    async function handleDelete(id: number) {
        LanguageApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
                appGridApi.current?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
            }
        });
    }
    async function handleExport(locale: string) {
        LanguageApi.exportLanguage(containerId as number, `${locale}.csv`).then(
            (reponse) => {
                updateLink({
                    name: `${locale}.csv`,
                    type: "file/csv",
                    file: reponse,
                });
            }
        );
    }
    async function handleImport(locale: string) {
        setSelectedLocale(`${locale}.csv`);
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    async function uploadFile(e: any) {
        isLoading(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        LanguageApi.importLanguage(
            containerId as number,
            selectedLocale,
            formData
        ).then(({ error, response }) => {
            isLoading(false);

            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                successToast("Imported!");
            }
        });
    }

    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            name: {
                filter: search,
            },
        });
    }

    return (
        <Fragment>
            {loading && <AppLoader />}

            <AppPageHeader
                title={"Languages"}
                createLink={"/admin/languages/new"}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            <input
                ref={fileInputRef}
                onChange={uploadFile}
                id="select-file"
                type="file"
                accept=".csv"
                hidden={true}
            />

            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appGridColDef({
                            onPressDelete: handleDelete,
                            onPressExport: handleExport,
                            onPressImport: handleImport,
                        })}
                        dataSource={getDataSource()}
                        totalItems={totalItems}
                        onReady={(event) => {
                            appGridApi.current = event.api;
                        }}
                    />
                </Col>
            </Row>
        </Fragment>
    );
};
