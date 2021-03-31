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
import {
    AppGrid,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { Language } from "../../models";
import { ListResponse } from "../../../AppModule/models";
import { appGridConfig } from "../../../AppModule/config";

const columnDef: ColDef[] = [
    {
        headerName: "Language",
        field: "name",
        flex: 2,
    },
    {
        headerName: "Locale",
        field: "locale",
    },
    {
        headerName: "Active",
        field: "isActive",
        cellRenderer: "appSwitch",
    },
    {
        headerName: "Default",
        field: "isDefault",
        cellRenderer: "appFormRadio",
    },
];

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
