import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressBookSession,
    onPressGetInContact,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "Name",
        field: "data",
        filter: "text",
        cellRenderer: "appNameTemplateRenderer",
        minWidth: 40,
        flex: 0.65,
    },
    {
        headerName: "Email",
        cellRenderer: "appEmailRenderer",
        field: "emailId",
        minWidth: 40,
        flex: 0.33,
    },
    {
        headerName: "Tags",
        field: "tags",
        cellRenderer: "appTagTemplateRenderer",
        minWidth: 40,
        flex: 0.8,
    },
    {
        headerName: "Category",
        field: "category",
        minWidth: 30,
        flex: 0.3,
    },
    {
        headerName: "Actions",
        sortable: false,
        maxWidth: 290,
        flex: 0.9,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressBookSession,
            onPressGetInContact,
        },
    },
];
