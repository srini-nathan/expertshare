import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppGridColDefParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
    editLink,
    addLink,
    ui,
}: AppGridColDefParams): ColDef[] => [
    {
        headerName: "Name",
        field: "name",
        filter: "text",
    },
    {
        headerName: "Client",
        field: "client",
        sortable: false,
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
        flex: 0.4,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            callback: onPressDelete,
            editLink,
            addLink,
            ui,
        },
    },
];
