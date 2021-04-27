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
    },
    {
        headerName: "Client",
        field: "client",
    },
    {
        headerName: "Is Generated",
        field: "isGenerated",
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
