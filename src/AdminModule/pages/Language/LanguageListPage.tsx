import React, { ChangeEventHandler, FC, Fragment, useState } from "react";
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
import { AppGridAction } from "../../../AppModule/components/AppGridAction";
import { AppFormRadio, AppSwitch } from "../../../AppModule/components";

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
        cellRendererParams: {
            onChange: (event: ChangeEventHandler) => {
                // eslint-disable-next-line no-console
                console.log("event", event);
            },
        },
    },
    {
        headerName: "Actions",
        field: "id",
        sortable: false,
        cellRenderer: "appGridActionRenderer",
    },
];

const frameworkComponents = {
    appSwitch: (params: any) => {
        const { data } = params;
        const { id, name, isActive } = data as Language;
        return (
            <AppSwitch
                name={`${name}-${id}`}
                id={`${name}-${id}`}
                value={isActive}
                onChange={(event) => {
                    LanguageApi.update<Language, Partial<Language>>(id, {
                        isActive: event.currentTarget.checked,
                    }).then();
                }}
            />
        );
    },
    appFormRadio: (params: any) => {
        const { data, onChange } = params;
        const { id, name, isDefault } = data as Language;
        return (
            <AppFormRadio
                name={`${name}`}
                id={`${name}-${id}`}
                value={isDefault}
                onChange={onChange}
            />
        );
    },
    appGridActionRenderer: AppGridAction,
};

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
                        frameworkComponents={frameworkComponents}
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
