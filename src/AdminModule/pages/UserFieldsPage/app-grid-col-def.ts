import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { CellActionParams } from "../LanguagePage";

export const appGridColDef = ({
    onPressDelete,
}: CellActionParams): ColDef[] => [
    {
        headerName: "Name",
        field: "name",
        filter: "text",
        minWidth: 30,
        flex: 0.35,
    },
    {
        headerName: "FieldType",
        field: "fieldType",
        minWidth: 30,
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