import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
    parentId,
}: AppCellActionParams): ColDef[] => [
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
        maxWidth: 120,
        cellRendererParams: {
            onPressDelete,
            parentId,
        },
    },
];
