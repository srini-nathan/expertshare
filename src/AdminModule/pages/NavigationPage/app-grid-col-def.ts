import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "admin.navigation.list:column.title",
        field: "translations.title",
        cellRenderer: "AppTitleRender",
        flex: 1,
    },
    {
        headerName: "admin.navigation.list:column.url",
        field: "url",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "admin.navigation.list:column.actions",
        field: "key",
        sortable: false,
        maxWidth: 160,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "AppGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];
