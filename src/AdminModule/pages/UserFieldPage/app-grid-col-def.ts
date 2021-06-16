import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "admin.userFields.list:column.name",
        field: "name",
        filter: "text",
        minWidth: 30,
        flex: 0.35,
    },
    {
        headerName: "admin.userFields.list:column.FieldType",
        field: "fieldType",
        minWidth: 30,
        flex: 0.35,
    },
    {
        headerName: "admin.userFields.list:column.actions",
        field: "id",
        sortable: false,
        maxWidth: 140,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];
