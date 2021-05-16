import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "Name",
        field: "name",
        filter: "text",
    },
    {
        headerName: "Is Generated",
        field: "isGenerated",
        sortable: false,
        cellRenderer: "appBooleanRender",
    },
    {
        headerName: "Actions",
        field: "id",
        sortable: false,
        maxWidth: 120,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];
