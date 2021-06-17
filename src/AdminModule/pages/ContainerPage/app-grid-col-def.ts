import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressDelete,
    onPressClone,
    parentId,
    hideParentFromUrl,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "admin.clients.containers.list:column.domain",
        field: "domain",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "admin.clients.containers.list:column.storage",
        field: "storage",
        sortable: false,
        flex: 1,
    },
    {
        headerName: "admin.clients.containers.list:column.actions",
        field: "id",
        sortable: false,
        cellRenderer: "appGridActionRenderer",
        cellClass: "text-right",
        headerClass: "action-header",
        maxWidth: 180,
        cellRendererParams: {
            onPressDelete,
            onPressClone,
            parentId,
            hideParentFromUrl,
        },
    },
];
