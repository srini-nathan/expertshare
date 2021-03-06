import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressDelete,
    parentId,
    grandParentId,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName:
            "sessionDetails:section.operatorActions.liveVote.list:column.name",
        field: "name",
        filter: "text",
    },
    {
        headerName:
            "sessionDetails:section.operatorActions.liveVote.list:column.actions",
        field: "id",
        sortable: false,
        maxWidth: 200,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "AppGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
            parentId,
            grandParentId,
        },
    },
];
