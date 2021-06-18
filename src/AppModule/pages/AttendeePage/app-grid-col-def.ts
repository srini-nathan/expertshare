import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const appGridColDef = ({
    onPressBookSession,
    onPressGetInContact,
    onPressAddNewUser,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "attendee.list:column.name",
        field: "name",
        filter: "name",
        cellRenderer: "appNameTemplateRenderer",
        minWidth: 40,
        flex: 0.65,
    },
    {
        headerName: "attendee.list:column.email",
        cellRenderer: "appEmailRenderer",
        field: "email",
        minWidth: 40,
        flex: 0.33,
    },
    {
        headerName: "attendee.list:column.tags",
        field: "tags",
        cellRenderer: "appTagTemplateRenderer",
        minWidth: 40,
        flex: 0.8,
    },
    {
        headerName: "attendee.list:column.category",
        field: "role",
        cellRenderer: "appCategoryTemplateRenderer",
        minWidth: 30,
        flex: 0.3,
    },
    {
        headerName: "attendee.list:column.actions",
        sortable: false,
        maxWidth: 290,
        flex: 0.9,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressBookSession,
            onPressGetInContact,
            onPressAddNewUser,
        },
    },
];
