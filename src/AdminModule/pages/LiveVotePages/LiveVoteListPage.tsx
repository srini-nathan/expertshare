import React, { FC, Fragment, useState, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { isString as _isString } from "lodash";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { appLiveVoteGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { LiveVoteQuestionApi } from "../../apis";
import { Language } from "../../models";
import { AppPageHeader } from "../../../AppModule/components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";
import { errorToast } from "../../../AppModule/utils";
import { useAuthState, useCRUDHelperFunctions } from "../../../AppModule/hooks";

export const LiveVoteListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { t } = useTranslation();
    const { containerId } = useAuthState();
    const {
        handleDeleteById,
        setFilter,
        buildDataSource,
    } = useCRUDHelperFunctions(LiveVoteQuestionApi, appGridApi);

    function getDataSource(): IServerSideDatasource {
        return buildDataSource({
            "container.id": containerId,
        });
    }

    async function handleDelete(id: number) {
        handleDeleteById(id, {
            success: "admin.liveVote.list:delete.toast.success",
        });
    }

    async function handleFilter(search: string) {
        setFilter(search, ["name"]);
    }

    return (
        <Fragment>
            <AppPageHeader
                title={t("admin.liveVote.list:header.title")}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appLiveVoteGridColDef({
                            onPressDelete: handleDelete,
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
