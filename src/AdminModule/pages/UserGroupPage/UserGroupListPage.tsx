import React, { FC, Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { isString as _isString } from "lodash";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { UserGroupApi } from "../../apis";
import { UserGroup } from "../../models";
import {
    AppPageHeader,
    AppListPageToolbar,
} from "../../../AppModule/components";
import {
    AppGrid,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";
import { errorToast, successToast } from "../../../AppModule/utils";
import "./assets/scss/list.scss";

export const UserGroupListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    let appGridApi: GridApi;

    const dataSource: IServerSideDatasource = {
        getRows(params: IServerSideGetRowsParams) {
            const { request } = params;
            const { endRow } = request;
            const pageNo = endRow / appGridConfig.pageSize;
            UserGroupApi.find<UserGroup>(pageNo, {
                order: buildSortParams(request),
            }).then(({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response?.totalItems && response?.items) {
                    setTotalItems(response.totalItems);
                    params.successCallback(response.items, response.totalItems);
                }
            });
        },
    };

    async function handleDelete(id: number) {
        UserGroupApi.delete(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
                appGridApi?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
            }
        });
    }

    return (
        <Fragment>
            <AppPageHeader title={"User Group"} />
            <AppListPageToolbar
                createLabel={"Create User Group"}
                createLink={"user-groups/new"}
            />
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appGridColDef({
                            onPressDelete: handleDelete,
                            editLink: "/admin/user-groups/",
                            ui: "User Group",
                        })}
                        dataSource={dataSource}
                        totalItems={totalItems}
                        onReady={(event) => {
                            appGridApi = event.api;
                        }}
                    />
                </Col>
            </Row>
            <hr />
        </Fragment>
    );
};
