import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionParams } from "../../../AppModule/models";

export const appGridColDefForRooms = ({
    onPressDelete,
    isGrantedControl,
}: AppCellActionParams): ColDef[] => {
    if (isGrantedControl)
        return [
            {
                headerName: "Room Name",
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
                headerName: "Actions",
                field: "id",
                sortable: false,
                minWidth: 320,
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

export const appGridColDefForPanels = ({
    onPressDelete,
    isGrantedControl,
}: AppCellActionParams): ColDef[] => {
    if (isGrantedControl)
        return [
            {
                headerName: "Panel ID",
                field: "id",
                filter: "id",
                sortable: true,
                minWidth: 80,
            },
            {
                headerName: "Actions",
                field: "id",
                sortable: false,
                maxWidth: 160,
                cellClass: "text-right justify-content-end",
                headerClass: "action-header",
                cellRenderer: "appGridActionRenderer",
                cellRendererParams: {
                    onPressDelete,
                    isGrantedControl,
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
            cellClass: "text-right justify-content-end",
            headerClass: "action-header",
            cellRenderer: "appGridActionRenderer",
            cellRendererParams: {
                onPressDelete,
                isGrantedControl,
            },
        },
    ];
};
