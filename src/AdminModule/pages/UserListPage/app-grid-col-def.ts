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
        minWidth: 10,
        maxWidth: 30,
        sortable: false,
    },

    {
        headerName: "admin.users.list:column.Name",
        field: "firstName",
        cellRenderer: "appNameTemplateRenderer",
        maxWidth: 220,
        sortable: true,
    },

    {
        headerName: "admin.users.list:column.companyName",
        field: "company",
        sortable: true,
        minWidth: 40,
    },
    {
        headerName: "admin.users.list:column.jobTitle",
        field: "jobTitle",
        sortable: true,
        minWidth: 40,
    },

    {
        headerName: "admin.users.list:column.email",
        field: "email",
        sortable: true,
        minWidth: 40,
    },
    {
        headerName: "admin.users.list:column.role",
        field: "role",
        cellRenderer: "appSelect",
        flex: 1,
        minWidth: 70,
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
        minWidth: 70,
        sortable: true,
    },
    {
        headerName: "admin.users.list:column.actions",
        field: "id",
        sortable: false,
        maxWidth: 160,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "appGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];
