import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDef = ({
    onPressDelete,
    onPressClone,
    isGrantedControl,
}: AppCellActionParams): ColDef[] => {
    if (isGrantedControl)
        return [
            {
                headerName: "admin.aframeroom.list:column.name",
                field: "name",
                filter: "translations.name",
                sortable: true,
                minWidth: 80,
            },
            {
                headerName: "admin.aframeroom.list:column.isEntryRoom",
                cellRenderer: "AppFormRadio",
                sortable: true,
                minWidth: 40,
            },
            {
                headerName: "admin.aframeroom.list:column.actions",
                field: "id",
                sortable: false,
                maxWidth: 220,
                cellClass: "text-right justify-content-end",
                headerClass: "action-header",
                cellRenderer: "appGridActionRenderer",
                cellRendererParams: {
                    onPressDelete,
                    isGrantedControl,
                    onPressClone,
                },
                lockPinned: true,
                pinned: "right",
            },
        ];

    return [
        {
            headerName: "admin.aframeroom.list:column.name",
            field: "name",
            filter: "translations.name",
            sortable: true,
            minWidth: 80,
        },
        {
            headerName: "admin.aframeroom.list:column.actions",
            field: "id",
            sortable: false,
            minWidth: 180,
            cellClass: "text-right justify-content-end",
            headerClass: "action-header",
            cellRenderer: "appGridActionRenderer",
            cellRendererParams: {
                onPressDelete,
                isGrantedControl,
            },
            lockPinned: true,
            pinned: "right",
        },
    ];
};
