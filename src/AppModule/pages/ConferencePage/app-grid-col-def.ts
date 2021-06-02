import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../models";

export const appGridColDef = ({
    onPressDelete,
}: AppCellActionParams): ColDef[] => [
    {
        headerName: "Name",
        field: "title",
        filter: "translations.title",
        sortable: true,
        minWidth: 80,
    },

    {
        headerName: "Description",
        field: "description",
        sortable: true,
        minWidth: 40,
    },

    {
        headerName: "Tags",
        cellRenderer: "tags",
        sortable: true,
        minWidth: 40,
    },

    {
        headerName: "Actions",
        field: "id",
        sortable: false,
        maxWidth: 125,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];
