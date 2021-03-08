import React, { FC, useEffect } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

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
                    onPaginationChanged={(event) => {
                        console.log(event);
                    }}
                >
                    <AgGridColumn field="id" sortable={true} filter={true} />
                    <AgGridColumn field="name" sortable={true} filter={true} />
                    <AgGridColumn field="notes" sortable={true} filter={true} />
                </AgGridReact>
            </div>
        </div>
    );
};

export default ClientList;
