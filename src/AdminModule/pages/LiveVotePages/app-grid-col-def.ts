import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "admin.liveVoteResult.list:column.name",
        field: "user.lastName",
        filter: "text",
        minWidth: 80,
        cellRenderer: "AppUserInfo",
        flex: 0.35,
    },
    {
        headerName: "admin.liveVoteResult.list:column.answer",
        field: "result",
        filter: "text",
        minWidth: 80,
        flex: 0.35,
    },
    {
        headerName: "admin.liveVoteResult.list:column.createdAt",
        field: "createdAt",
        filter: "text",
        cellRenderer: "AppCreatedAt",
        minWidth: 80,
        flex: 0.35,
    },
    {
        headerName: "admin.liveVoteResult.list:column.actions",
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
