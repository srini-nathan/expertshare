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
                headerName: "event.list:column.title",
                field: "title",
                filter: "translations.title",
                sortable: true,
                minWidth: 80,
            },

            {
                headerName: "event.list:column.tags",
                cellRenderer: "tags",
                sortable: true,
                minWidth: 40,
            },
            {
                headerName: "event.list:column.isVisible",
                cellRenderer: "appSwitch",
                sortable: true,
                minWidth: 40,
            },

            {
                headerName: "event.list:column.actions",
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
            headerName: "event.list:column.title",
            field: "title",
            filter: "translations.title",
            sortable: true,
            minWidth: 80,
        },

        {
            headerName: "event.list:column.tags",
            cellRenderer: "tags",
            sortable: true,
            minWidth: 40,
        },

        {
            headerName: "event.list:column.actions",
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
