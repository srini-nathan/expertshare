import React, { FC, Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import {
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { AppPageHeader } from "../../../AppModule/components/AppPageHeader";
import { AppListPageToolbar } from "../../../AppModule/components/AppListPageToolbar";
import { LanguageApi } from "../../apis/LanguageApi";
import { AppGrid } from "../../../AppModule/containers/AppGrid";
import { Language } from "../../models";
import { ListResponse } from "../../../AppModule/models";
import { appGridConfig } from "../../../AppModule/config";

const columnDef: ColDef[] = [
    {
        headerName: "ID",
        field: "id",
        flex: 1,
    },
    {
        headerName: "Language",
        field: "name",
        flex: 2,
    },
    {
        headerName: "Locale",
        field: "locale",
    },
];

export const LanguageListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const dataSource: IServerSideDatasource = {
        getRows(params: IServerSideGetRowsParams) {
            const { request } = params;
            const { endRow } = request;
            const pageNo = endRow / appGridConfig.pageSize;
            LanguageApi.findAll<Language>(pageNo).then(
                (res: ListResponse<Language>) => {
                    setTotalItems(res.totalItems);
                    params.successCallback(res.items, res.totalItems);
                }
            );
        },
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
                        columnDef={columnDef}
                        dataSource={dataSource}
                        totalItems={totalItems}
                    />
                </Col>
            </Row>
            <hr />
        </Fragment>
    );
};
