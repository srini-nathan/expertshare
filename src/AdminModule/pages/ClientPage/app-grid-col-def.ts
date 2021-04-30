import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppGridColDefParams } from "../../../AppModule/models";
import { ClientApi } from "../../apis";

export const appGridColDef = ({
    onPressDelete,
}: AppGridColDefParams): ColDef[] => [
    {
        headerName: "Client",
        field: "name",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "Notes",
        field: "notes",
        sortable: false,
        flex: 2,
    },
    {
        headerName: "Actions",
        field: "id",
        sortable: false,
        cellRenderer: "appGridActionRenderer",
        cellClass: "text-right",
        headerClass: "action-header",
        resizable: false,
        maxWidth: 215,
        cellRendererParams: {
            callback: onPressDelete,
            editLink: ClientApi.CLIENT_LIST_PAGE_PATH,
            addLink: ClientApi.CLIENT_NEW_PAGE_PATH,
            listTree: true,
            listTreeSubUrl: "container",
            ui: "Client",
        },
    },
];
