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
        minWidth: 80,
        flex: 0.35,
    },
    {
        headerName: "Locale",
        field: "locale",
        minWidth: 40,
        flex: 0.35,
    },
    {
        headerName: "Active",
        field: "isActive",
        cellRenderer: "appSwitch",
        flex: 1,
        minWidth: 70,
    },
    {
        headerName: "Default",
        field: "isDefault",
        cellRenderer: "appFormRadio",
        minWidth: 40,
        flex: 0.3,
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
        flex: 0.4,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            callback: onPressDelete,
            editLink,
            addLink,
        },
    },
];
