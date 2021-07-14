import React, { FC, Fragment, useState, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { useRecoilState } from "recoil";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { AppLoader, AppPageHeader } from "../../../AppModule/components";
import { AppGrid } from "../../../AppModule/containers/AppGrid";
import { Navigation } from "../../models";
import { appContainerNavigation } from "../../../AppModule/atoms";

export const NavigationListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { t } = useTranslation();
    const [navigation] = useRecoilState<Navigation[]>(appContainerNavigation);

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { api } = params;
                api?.hideOverlay();
                if (navigation && navigation.length > 0) {
                    params.successCallback(
                        navigation.map((n) => {
                            return {
                                id: n.key,
                                ...n,
                            };
                        }),
                        navigation.length
                    );
                    setTotalItems(navigation.length);
                } else {
                    params.successCallback([], 0);
                    setTotalItems(0);
                    api?.showNoRowsOverlay();
                }
            },
        };
    }

    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            url: {
                filter: search,
            },
            "translations.title": {
                filter: search,
            },
        });
    }


    if (loading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppPageHeader
                title={t("admin.navigation.list:header.title")}
                createLink={"/admin/navigations/new"}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />

            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appGridColDef({
                            onPressDelete: () => {},
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
