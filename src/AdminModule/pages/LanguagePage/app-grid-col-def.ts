import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressDelete,
    onPressExport,
    onPressImport,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "admin.language.list:column.name",
        field: "name",
        filter: "text",
        minWidth: 80,
        flex: 0.35,
    },
    {
        headerName: "admin.language.list:column.locale",
        field: "locale",
        minWidth: 40,
        flex: 0.35,
    },
    {
        headerName: "admin.language.list:column.active",
        field: "isActive",
        cellRenderer: "AppSwitch",
        flex: 1,
        minWidth: 70,
        sortable: false,
    },
    {
        headerName: "admin.language.list:column.default",
        field: "isDefault",
        cellRenderer: "AppFormRadio",
        minWidth: 40,
        flex: 0.3,
        sortable: false,
    },
    {
        headerName: "admin.language.list:column.language",
        field: "id",
        sortable: false,
        maxWidth: 210,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "AppGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
            onPressExport,
            onPressImport,
        },
        lockPinned: true,
        pinned: "right",
    },
];
