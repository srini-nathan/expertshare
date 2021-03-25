import { FC, useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./assets/scss/style.scss";
import { GridApi, GridReadyEvent } from "ag-grid-community";

export interface AppGridProps {
    data: any[];
}

export const AppGrid: FC<AppGridProps> = ({ data }) => {
    const [gridApi, setGridApi] = useState<GridApi>();

    const onGridReady = (params: GridReadyEvent) => {
        const { api } = params;
        setGridApi(api);
    };

    useEffect(() => {
        gridApi?.refreshCells();
        console.log(data, "data");
    }, [data]);

    return (
        <div
            className="ag-theme-alpine d-flex"
            style={{ height: 400, width: 600 }}
        >
            <AgGridReact onGridReady={onGridReady} rowData={data}>
                <AgGridColumn field="make"></AgGridColumn>
                <AgGridColumn field="model"></AgGridColumn>
                <AgGridColumn field="price"></AgGridColumn>
            </AgGridReact>
        </div>
    );
};
