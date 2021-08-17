import React, { FC, Fragment, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { GridApi, IServerSideDatasource } from "ag-grid-community";
import { Canceler } from "axios";
import { appLiveVoteGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { LiveVoteQuestionApi } from "../../apis";
import { AppPageHeader } from "../../../AppModule/components";
import { AppGrid } from "../../../AppModule/containers/AppGrid";
import { useAuthState, useCRUDHelperFunctions } from "../../../AppModule/hooks";
import { LiveVoteQuestion } from "../../models";

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
        return buildDataSource<LiveVoteQuestion>(
            {
                "container.id": containerId,
            },
            cancelTokenSourcesRef,
            {
                onSuccess: (response) => {
                    setTotalItems(response.totalItems);
                },
            }
        );
    }

    function handleDelete(id: number) {
        handleDeleteById(id, {
            success: "admin.liveVote.list:delete.toast.success",
        });
    }

    function handleFilter(search: string) {
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
