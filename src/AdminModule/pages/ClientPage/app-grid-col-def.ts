import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "admin.client.list:column.name",
        field: "name",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "admin.client.list:column.notes",
        field: "notes",
        sortable: false,
        flex: 2,
    },
    {
        headerName: "admin.client.list:column.actions",
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
        lockPinned: true,
        pinned: "right",
    },
];
