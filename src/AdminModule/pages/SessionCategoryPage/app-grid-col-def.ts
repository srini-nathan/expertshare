import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "Name",
        field: "name",
        filter: "text",
        minWidth: 80,
        flex: 0.35,
    },
    {
        headerName: "Color",
        field: "color",
        cellRenderer: "AppColorPickerRender",
        minWidth: 40,
        flex: 0.4,
        sortable: false,
    },

    {
        headerName: "Text Color",
        field: "textColor",
        cellRenderer: "AppColorPickerRender",
        minWidth: 40,
        flex: 0.4,
        sortable: false,
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
