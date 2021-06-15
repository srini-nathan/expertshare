import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressDelete,
    onPressClone,
    parentId,
    hideParentFromUrl,
}: AppCellActionWithCustom): ColDef[] => [
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
        maxWidth: 180,
        cellRendererParams: {
            onPressDelete,
            onPressClone,
            parentId,
            hideParentFromUrl,
        },
    },
];
