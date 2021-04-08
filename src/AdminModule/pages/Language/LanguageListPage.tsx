import React, { FC, Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import {
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { LanguageApi } from "../../apis/LanguageApi";
import { Language } from "../../models";
import { AppPageHeader } from "../../../AppModule/components/AppPageHeader";
import { AppListPageToolbar } from "../../../AppModule/components/AppListPageToolbar";
import {
    AppGrid,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { ListResponse } from "../../../AppModule/models";
import { appGridConfig } from "../../../AppModule/config";
import { sweetError, sweetSuccess } from "../../../AppModule/components/Util";

export const LanguageListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const dataSource: IServerSideDatasource = {
        getRows(params: IServerSideGetRowsParams) {
            const { request } = params;
            const { endRow } = request;
            const pageNo = endRow / appGridConfig.pageSize;
            LanguageApi.findAll<Language>(pageNo, {
                order: buildSortParams(request),
            }).then((res: ListResponse<Language>) => {
                setTotalItems(res.totalItems);
                params.successCallback(res.items, res.totalItems);
            });
        },
    };

    const handleDelete = async (id: number) => {
        LanguageApi.delete<void>(id).then(
            () => {
                sweetSuccess({ text: " Successfully deleted " });
            },
            () => {
                sweetError({
                    text:
                        "Something went wrong, please reload browser and try again!",
                });
            }
        );
    };

    return (
        <Fragment>
            <AppPageHeader title={"Language"} />
            <AppListPageToolbar
                createLabel={"Create Language"}
                createLink={"languages/new"}
            />
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appGridColDef({
                            onPressDelete: handleDelete,
                            editLink: "/admin/languages/",
                            addLink: "/admin/languages/add",
                        })}
                        dataSource={dataSource}
                        totalItems={totalItems}
                    />
                </Col>
            </Row>
            <hr />
        </Fragment>
    );
};
