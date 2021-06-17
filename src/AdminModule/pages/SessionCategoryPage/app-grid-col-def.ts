import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "admin.sessionCategory.list:column.name",
        field: "name",
        filter: "text",
        minWidth: 80,
        flex: 0.35,
    },
    {
        headerName: "admin.sessionCategory.list:column.Color",
        field: "color",
        cellRenderer: "AppColorPickerRender",
        minWidth: 40,
        flex: 0.4,
        sortable: false,
    },

    {
        headerName: "admin.sessionCategory.list:column.textColor",
        field: "textColor",
        cellRenderer: "AppColorPickerRender",
        minWidth: 40,
        flex: 0.4,
        sortable: false,
    },
    {
        headerName: "admin.sessionCategory.list:column.action",
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
