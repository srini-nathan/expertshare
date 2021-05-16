import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "Name",
        field: "name",
        filter: "text",
        minWidth: 40,
        flex: 0.35,
    },
    {
        headerName: "Subject",
        field: "subject",
        minWidth: 40,
        flex: 0.35,
    },
    {
        headerName: "Actions",
        field: "id",
        sortable: false,
        maxWidth: 160,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];
