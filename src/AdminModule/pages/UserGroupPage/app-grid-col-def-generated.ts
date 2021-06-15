import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";

export const appGridColDefGenerated = (): ColDef[] => [
    {
        headerName: "Name",
        field: "name",
        filter: "text",
    },
];
