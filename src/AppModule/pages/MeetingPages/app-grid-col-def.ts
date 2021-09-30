import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppCellActionWithCustom } from "./app-actions";

export const myMeetingsGridColDef = ({
    onPressDelete,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "meeting.myMeetings.list:column.name",
        field: "name",
        cellRenderer: "AppNameRender",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "meeting.myMeetings.list:column.isActive",
        field: "isActive",
        cellRenderer: "AppFormRadio",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "meeting.myMeetings.list:column.actions",
        field: "id",
        sortable: false,
        maxWidth: 160,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "AppGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];

export const myBookingsGridColDef = ({
    onPressDelete,
}: AppCellActionWithCustom): ColDef[] => [
    {
        headerName: "meeting.myBookings.list:column.name",
        field: "meeting.name",
        cellRenderer: "AppNameRender",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "meeting.myBookings.list:column.time",
        field: "time",
        cellRenderer: "AppTimeRender",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "meeting.myBookings.list:column.actions",
        field: "id",
        sortable: false,
        maxWidth: 160,
        cellClass: "text-right",
        headerClass: "action-header",
        cellRenderer: "AppGridActionRenderer",
        cellRendererParams: {
            onPressDelete,
        },
    },
];

export const myMeetingsDetailGridColDef = (): ColDef[] => [
    {
        headerName: "meeting.myBookings.list:column.name",
        field: "name",
        cellRenderer: "AppTitleRender",
        filter: "text",
        flex: 1,
    },
    {
        headerName: "meeting.myBookings.list:column.time",
        field: "time",
        filter: "text",
        flex: 1,
    },
];
