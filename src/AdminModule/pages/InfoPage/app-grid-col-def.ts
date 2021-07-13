import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "admin.infopage.list:column.title",
        field: "title",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "admin.infopage.list:column.slugKey",
        field: "slugKey",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "admin.infopage.list:column.actions",
        field: "id",
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
