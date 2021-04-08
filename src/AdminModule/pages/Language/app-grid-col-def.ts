import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { ChangeEventHandler } from "react";

interface AppGridColDefParams {
    onPressDelete: (id: number) => void;
    editLink: string;
    addLink: string;
}

export const appGridColDef = ({
    onPressDelete,
    editLink,
    addLink,
}: AppGridColDefParams): ColDef[] => [
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
        cellRendererParams: {
            callback: onPressDelete,
            editLink,
            addLink,
        },
    },
];
