import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "admin.emailTemplate.list:column.name",
        field: "name",
        filter: "text",
        minWidth: 40,
        flex: 0.35,
    },
    {
        headerName: "admin.emailTemplate.list:column.subject",
        field: "subject",
        minWidth: 40,
        flex: 0.35,
    },
    {
        headerName: "admin.emailTemplate.list:column.actions",
        field: "id",
        sortable: false,
        maxWidth: 160,
        cellClass: "text-right justify-content-end",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
        lockPinned: true,
        pinned: "right",
    },
];
