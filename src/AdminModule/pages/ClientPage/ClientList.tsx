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
        <div>
            <Link to="/admin/client/new">Add New Client</Link>
            <div
                className="ag-theme-alpine"
                style={{ height: 800, width: 1000, padding: 100 }}
            >
                <AgGridReact
                    rowData={clients}
                    pagination={true}
                    paginationPageSize={10}
                    columnDefs={columnDef}
                />
            </div>
        </div>
    );
};
