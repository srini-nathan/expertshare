import React, { FC, useEffect } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { AgGridReact } from "ag-grid-react";

import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { Search } from "react-feather";
// import { Pagination } from "../../../SharedModule/components/Pagination/Pagination";
// import { ICellRendererParams } from "ag-grid-community";
import { Api, Client } from "../../../lib/API/Api";
import "./style.scss";
import { ClientApi } from "../../apis/ClientApi";

// TODO:: Add header => name=> ES-DOMAIN value=>  domain.name(react client) currently on

// TODO:  logged in=> jwt=> /me/? => container id=> i keep it => LocalStorage ...(will be provided )

const BtnCellRenderer = () => {
    return (
        <div>
            <a href="#">
                <svg
                    width="44"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 6H5H21"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M10 11V17"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M14 11V17"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </a>
            <a href="#">
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M21 31H30"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M25.5 14.5002C25.8978 14.1024 26.4374 13.8789 27 13.8789C27.2786 13.8789 27.5544 13.9338 27.8118 14.0404C28.0692 14.147 28.303 14.3032 28.5 14.5002C28.697 14.6972 28.8532 14.9311 28.9598 15.1884C29.0665 15.4458 29.1213 15.7217 29.1213 16.0002C29.1213 16.2788 29.0665 16.5547 28.9598 16.812C28.8532 17.0694 28.697 17.3032 28.5 17.5002L16 30.0002L12 31.0002L13 27.0002L25.5 14.5002Z"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </a>
            <a href="#">
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M13.5 21H30.5"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M22 29.5V12.5"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </a>
            <a href="#">
                <svg
                    width="32"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M26 24C26 25.6569 27.3431 27 29 27C30.6569 27 32 25.6569 32 24C32 22.3431 30.6569 21 29 21C27.3431 21 26 22.3431 26 24Z"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M26 34C26 35.6569 27.3431 37 29 37C30.6569 37 32 35.6569 32 34C32 32.3431 30.6569 31 29 31C27.3431 31 26 32.3431 26 34Z"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M26 24L12 24"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M26 34L12 34"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M30 8H14C12.8954 8 12 8.89543 12 10V14C12 15.1046 12.8954 16 14 16H30C31.1046 16 32 15.1046 32 14V10C32 8.89543 31.1046 8 30 8Z"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M12 14V34"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </a>
        </div>
    );
};

export const ClientList: FC<RouteComponentProps> = (): JSX.Element => {
    const [clients, setClients] = React.useState<Client[]>([]);

    useEffect(() => {
        async function fetchClients() {
            const fetchedClients = await ClientApi.findAll<Client[]>(1);
            setClients(fetchedClients);
        }

        fetchClients().then();
        return () => {};
    }, []);

    console.log(packages);
    if (clients.length === 0) {
        return <div>Loading!!</div>;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onPageChange = (pageNumber: number) => {};

    // const onPageChange = (pageNumber: number) => {
    //     console.log(pageNumber);
    // };
    const onGridReady = (params: any) => {
        params.api.setRowCount(1000);
    };
    const datasource = {
        getRows(params: any) {
            // console.log(JSON.stringify(params.request, null, 1));
            //
            if (!params.request.startRow) {
                Api.getClients(1).then((response) =>
                    params.successCallback(response, response[20])
                );
            }
            // fetch("./olympicWinners/", {
            //     method: "post",
            //     body: JSON.stringify(params.request),
            //     headers: { "Content-Type": "application/json; charset=utf-8" },
            // })
            //     .then((httpResponse) => httpResponse.json())
            //     .then((response) => {
            //         params.successCallback(response.rows, response.lastRow);
            //     })
            //     .catch((error) => {
            //         console.error(error);
            //         params.failCallback();
            //     });
        },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onPageChange = (pageNumber: number) => {};

    const columnDef: ColDef[] = [
        {
            headerName: "Client",
            field: "name",
            flex: 1,
        },
        {
            headerName: "Notes",
            field: "notes",
            flex: 2,
        },
        {
            headerName: "Actions",
            field: "id",
            sortable: false,
            cellRendererFramework() {
                return <BtnCellRenderer />;
            },
        },
    ];
    return (
        <div className="theme-primary-clr theme-primary-font">
            <div className="container-fluid p-0 mb-5">
                <div className="row m-0">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="nav-header mt-5 col-12">
                                <div className="row">
                                    <div className="col-md-9 nav-header--left">
                                        <div className="page-title col-12">
                                            <h1 className="theme-primary-font-bold theme-header-font-color">
                                                Clients
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="app-container col-12">
                                <div className="row m-0">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-3 offset-md-7 search-inpt ">
                                                <form>
                                                    <input
                                                        type="text"
                                                        name="searchBox"
                                                        id="searchBox"
                                                        className="form-control theme-input theme-border-radius"
                                                        placeholder="Quick Search"
                                                    />
                                                    <Search />
                                                </form>
                                            </div>
                                            <div className="col-md-2 m-auto">
                                                <Link
                                                    className="btn btn-block btn-primary theme-btn-primary"
                                                    to="/admin/client/new"
                                                >
                                                    Add New Client
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 table-responsive">
                                        <div
                                            className="ag-theme-alpine"
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                            }}
                                        >
                                            <AgGridReact
                                                gridOptions={{
                                                    defaultColDef: {
                                                        sortable: true,
                                                    },
                                                    rowModelType: "serverSide",
                                                    rowHeight: 70,
                                                    serverSideDatasource: datasource,
                                                }}
                                                onGridReady={onGridReady}
                                                pagination={true}
                                                // rowData={clients}
                                                // pagination={true}
                                                // suppressPaginationPanel={false}
                                                // paginationPageSize={10}
                                                columnDefs={columnDef}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <Pagination */}
                            {/*    totalRows={255} */}
                            {/*    currentPage={1} */}
                            {/*    pageLimit={10} */}
                            {/*    onPageChange={onPageChange} */}
                            {/* /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
