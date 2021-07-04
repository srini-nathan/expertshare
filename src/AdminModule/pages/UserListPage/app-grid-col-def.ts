import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParamsUserList } from "./AppCellActionParamsUserList";

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
    },

    {
        headerName: "admin.users.list:column.Name",
        field: "user_search",
        filter: "text",
        cellRenderer: "appNameTemplateRenderer",
        maxWidth: 220,
        minWidth: 220,
        flex: 1.5,
        sortable: false,
    },

    {
        headerName: "admin.users.list:column.companyName",
        field: "company",
        sortable: true,
        minWidth: 150,
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
        flex: 1,
        minWidth: 160,
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
        minWidth: 50,
        sortable: true,
    },
    {
        headerName: "admin.users.list:column.actions",
        field: "id",
        sortable: false,
        flex: 0.5,
        minWidth: 180,
        maxWidth: 300,
        cellClass: "text-right justify-content-end",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];
