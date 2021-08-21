import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

let getWidth = "right";
if (window.innerWidth < 760) {
    getWidth = "";
}
export const appGridColDef = ({
    onPressBookSession,
    onPressGetInContact,
    onPressAddNewUser,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "attendee.list:column.name",
        field: "user_search",
        filter: "text",
        cellRenderer: "appNameTemplateRenderer",
        cellClass: "title-cell",
        flex: 1.5,
        minWidth: 200,
    },
    {
        headerName: "attendee.list:column.email",
        cellRenderer: "appEmailRenderer",
        field: "email",
        flex: 1,
        minWidth: 200,
    },
    {
        headerName: "attendee.list:column.tags",
        field: "tags",
        cellRenderer: "appTagTemplateRenderer",
        flex: 1.5,
        minWidth: 350,
    },
    {
        headerName: "attendee.list:column.category",
        field: "role",
        cellRenderer: "appCategoryTemplateRenderer",
        flex: 1,
        minWidth: 200,
    },
    {
        headerName: "attendee.list:column.actions",
        sortable: false,
        maxWidth: 300,
        flex: 1,
        cellClass: "text-right action-cell",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressBookSession,
            onPressGetInContact,
            onPressAddNewUser,
        },
        lockPinned: true,
        pinned: getWidth,
    },
];
