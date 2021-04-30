import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppGridColDefParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
    editLink,
}: AppGridColDefParams): ColDef[] => [
    {
        headerName: "Domain",
        field: "domain",
        filter: "text",
    },
    {
        headerName: "Storage",
        field: "storage",
        sortable: false,
    },
    {
        headerName: "Actions",
        field: "id",
        sortable: false,
        cellRenderer: "appGridActionRenderer",
        cellClass: "text-right",
        headerClass: "action-header",
        cellRendererParams: {
            callback: onPressDelete,
            addLink: undefined,
            editLink,
            ui: "Container",
        },
    },
];
