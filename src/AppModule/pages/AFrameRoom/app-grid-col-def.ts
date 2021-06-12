import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../models";

export const appGridColDef = ({
    onPressDelete,
    onPressClone,
    isGrantedControl,
}: AppCellActionParams): ColDef[] => {
    if (isGrantedControl)
        return [
            {
                headerName: "Name",
                field: "name",
                filter: "translations.name",
                sortable: true,
                minWidth: 80,
            },
            {
                headerName: "Is Entry Room",
                cellRenderer: "appSwitch",
                sortable: true,
                minWidth: 40,
            },
            {
                headerName: "Actions",
                field: "id",
                sortable: false,
                maxWidth: 220,
                cellClass: "text-right",
                headerClass: "action-header",
                cellRenderer: "appGridActionRenderer",
                cellRendererParams: {
                    onPressDelete,
                    isGrantedControl,
                    onPressClone,
                },
            },
        ];

    return [
        {
            headerName: "Name",
            field: "name",
            filter: "translations.name",
            sortable: true,
            minWidth: 80,
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
                isGrantedControl,
            },
        },
    ];
};
