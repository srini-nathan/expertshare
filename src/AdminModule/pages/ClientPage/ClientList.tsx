import React, { FC, useEffect } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { AgGridReact } from "ag-grid-react";

import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";

import { ICellRendererParams } from "ag-grid-community";
import { Api, Client } from "../../../lib/API/Api";

// TODO:: Add header => name=> ES-DOMAIN value=>  domain.name(react client) currently on

// TODO:  logged in=> jwt=> /me/? => container id=> i keep it => LocalStorage ...(will be provided )
export const ClientList: FC<RouteComponentProps> = (): JSX.Element => {
    const [clients, setClients] = React.useState<Client[]>([]);

    useEffect(() => {
        async function fetchClients() {
            const fetchedClients = await Api.getClients(1);
            setClients(fetchedClients);
        }

        fetchClients().then();
        return () => {};
    }, []);

    if (clients.length === 0) {
        return <div>Loading!!</div>;
    }
    const handleClick = () => {};

    const columnDef: ColDef[] = [
        {
            headerName: "ID",
            field: "id",
        },
        {
            headerName: "ID",
            field: "name",
        },
        {
            headerName: "Notes",
            field: "note",
        },
        {
            headerName: "Edit",
            field: "id",
            cellRendererFramework({ value }: ICellRendererParams) {
                return <Link to={`/admin/client/${value}`}>Edit</Link>;
            },
        },
        {
            headerName: "Delete",
            field: "id",
            cellRendererFramework() {
                return <button onClick={handleClick}> Test </button>;
            },
        },
    ];
    return (
        <div className="theme-primary-clr theme-primary-font">
            <div className="container-fluid p-0 mb-5">
                <div className="row m-0">
                    <div className="col-md-9 col-xl-10">
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
                                                    <i data-feather="search"></i>
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
                                                height: 800,
                                                width: 1000,
                                                padding: 100,
                                            }}
                                        >
                                            <AgGridReact
                                                rowData={clients}
                                                pagination={true}
                                                paginationPageSize={10}
                                                columnDefs={columnDef}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
