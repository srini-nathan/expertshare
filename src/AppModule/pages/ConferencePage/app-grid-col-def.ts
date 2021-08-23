import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../models";

let getWidth = "right";
if (window.innerWidth < 760) {
    getWidth = "";
}
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
                flex: 1.5,
                minWidth: 200,
                cellClass: "title-cell",
                cellRenderer: "renderName",
            },

            {
                headerName: "event.list:column.tags",
                cellRenderer: "tags",
                sortable: true,
                flex: 1.5,
                minWidth: 200,
            },
            {
                headerName: "event.list:column.isVisible",
                cellRenderer: "appSwitch",
                sortable: true,
                flex: 1,
                minWidth: 100,
            },

            {
                headerName: "event.list:column.actions",
                field: "id",
                sortable: false,
                flex: 0.2,
                minWidth: 200,
                cellClass: "action-cell text-right",
                headerClass: "action-header",
                cellRenderer: "appGridActionRenderer",
                cellRendererParams: {
                    onPressDelete,
                    isGrantedControl,
                    onPressClone,
                },
                lockPinned: true,
                pinned: getWidth,
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
