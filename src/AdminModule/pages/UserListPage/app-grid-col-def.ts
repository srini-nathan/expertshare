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
        headerName: "First Name",
        field: "firstName",
        filter: "text",
        sortable: true,
        minWidth: 80,
    },
    {
        headerName: "Last Name",
        field: "lastName",
        sortable: true,
        minWidth: 40,
    },

    {
        headerName: "Company",
        field: "company",
        sortable: true,
        minWidth: 40,
    },
    {
        headerName: "Job Title",
        field: "jobTitle",
        sortable: true,
        minWidth: 40,
    },

    {
        headerName: "Email",
        field: "email",
        sortable: true,
        minWidth: 40,
    },
    {
        headerName: "Role",
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
        headerName: "Actions",
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
