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
        flex: 1,
    },
    {
        headerName: "Storage",
        field: "storage",
        sortable: false,
        flex: 1,
    },
    {
        headerName: "Actions",
        field: "id",
        sortable: false,
        cellRenderer: "appGridActionRenderer",
        cellClass: "text-right",
        headerClass: "action-header",
        maxWidth: 120,
        cellRendererParams: {
            callback: onPressDelete,
            addLink: undefined,
            editLink,
            ui: "Container",
        },
    },
];
