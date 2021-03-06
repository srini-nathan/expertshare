import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParamsUserList } from "./AppCellActionParamsUserList";

let getWidth = "right";
if (window.innerWidth < 760) {
    getWidth = "";
}
export const appGridColDef = ({
    onPressDelete,
    onCheckHeaderCheckbox,
    onCheckCheckbox,
    onSelectChange,
    selectedUserList,
}: AppCellActionParamsUserList): ColDef[] => [
    {
        field: "role",
        cellRenderer: "appCheckBox",
        headerComponent: "AppHeaderChekbox",
        headerComponentParams: {
            onCheckHeaderCheckbox,
        },
        cellRendererParams: {
            selectedUserList,
            onCheckCheckbox,
        },
        minWidth: 50,
        maxWidth: 50,
        flex: 0.2,
        sortable: false,
        headerClass: "checkbox-header",
    },

    {
        headerName: "admin.users.list:column.Name",
        field: "user_search",
        filter: "text",
        cellRenderer: "appNameTemplateRenderer",
        minWidth: 220,
        flex: 1.5,
        sortable: true,
    },

    {
        headerName: "admin.users.list:column.companyName",
        field: "company",
        sortable: true,
        minWidth: 190,
        flex: 1,
    },
    {
        headerName: "admin.users.list:column.jobTitle",
        field: "jobTitle",
        sortable: true,
        minWidth: 150,
        flex: 1,
    },

    {
        headerName: "admin.users.list:column.email",
        field: "email",
        sortable: true,
        minWidth: 210,
        flex: 1,
    },
    {
        headerName: "admin.users.list:column.role",
        field: "role",
        cellRenderer: "appSelect",
        flex: 1.1,
        minWidth: 180,
        sortable: true,
        cellRendererParams: {
            onSelectChange,
        },
    },

    {
        headerName: "admin.users.list:column.isBlocked",
        field: "isBlocked",
        cellRenderer: "appSwitch",
        flex: 1,
        minWidth: 140,
        sortable: true,
    },
    {
        headerName: "admin.users.list:column.actions",
        field: "id",
        sortable: false,
        flex: 1.8,
        minWidth: 200,
        maxWidth: 380,
        cellClass: "text-right justify-content-end",
        headerClass: "action-header",
        cellRenderer: "AppGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
        lockPinned: true,
        pinned: getWidth,
    },
];
