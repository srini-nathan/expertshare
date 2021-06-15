import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "Client",
        field: "name",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "Notes",
        field: "notes",
        sortable: false,
        flex: 2,
    },
    {
        headerName: "Actions",
        field: "id",
        sortable: false,
        cellRenderer: "appGridActionRenderer",
        cellClass: "text-right",
        headerClass: "action-header",
        resizable: false,
        maxWidth: 165,
        cellRendererParams: {
            onPressDelete,
        },
    },
];
