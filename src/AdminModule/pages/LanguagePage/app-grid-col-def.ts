import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppGridColDefParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
    editLink,
    addLink,
}: AppGridColDefParams): ColDef[] => [
    {
        headerName: "Language",
        field: "name",
        filter: "text",
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
        sortable: false,
    },
    {
        headerName: "Default",
        field: "isDefault",
        cellRenderer: "appFormRadio",
        minWidth: 40,
        flex: 0.3,
        sortable: false,
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
