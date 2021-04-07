import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { ChangeEventHandler } from "react";

export const appGridColDef: ColDef[] = [
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
