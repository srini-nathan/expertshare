import React, { FC, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridEvent, GridApi } from "ag-grid-community";
import { ColumnApi } from "ag-grid-community/dist/lib/columnController/columnApi";

interface AgGridResponse {
    make: string;
    model: string;
    price: number;
}
export const AgGridPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [gridApi, setGridApi] = React.useState<GridApi>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [gridColumnApi, setGridColumnApi] = React.useState<ColumnApi>();

    const [rowData, setRowData] = React.useState([
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 },
        72000,
    ]);

    useEffect(() => {
        fetch("https://www.ag-grid.com/example-assets/row-data.json")
            .then((result) => result.json())
            .then((rawData) => setRowData(rawData));
    }, []);

    const onGridReady = (params: AgGridEvent) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onButtonClick = () => {
        const selectedNodes = gridApi?.getSelectedNodes();
        const selectedData = selectedNodes?.map((node) => node.data);

        const selectedDataStringPresentation = selectedData
            ?.map((node: AgGridResponse) => `${node.make} ${node.model}`)
            .join(", ");
        // eslint-disable-next-line no-alert
        alert(`Selected nodes: ${selectedDataStringPresentation}`);
    };
    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
            <button onClick={onButtonClick}>Get selected rows</button>
            <AgGridReact
                onGridReady={onGridReady}
                rowData={rowData}
                rowSelection={"multiple"}
                groupSelectsChildren={true}
                autoGroupColumnDef={{
                    headerName: "Model",
                    field: "model",
                    cellRenderer: "agGroupCellRenderer",
                    cellRendererParams: {
                        checkbox: true,
                    },
                }}
            >
                <AgGridColumn
                    field="make"
                    sortable={true}
                    filter={true}
                    checkboxSelection={true}
                />
                <AgGridColumn field="model" sortable={true} filter={true} />
                <AgGridColumn field="price" sortable={true} filter={true} />
            </AgGridReact>
        </div>
    );
};

export default AgGridPage;
