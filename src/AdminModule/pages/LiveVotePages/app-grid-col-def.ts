import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appLiveVoteResultGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
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
        cellRenderer: "AppLiveVoteResultGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];

export const appLiveVoteGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "admin.liveVote.list:column.name",
        field: "name",
        filter: "text",
    },
    {
        headerName: "admin.liveVote.list:column.actions",
        field: "id",
        sortable: false,
        maxWidth: 200,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "AppLiveVoteGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];
