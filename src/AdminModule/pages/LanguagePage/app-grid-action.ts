import { ICellRendererParams } from "ag-grid-community";
// @TODO: Move these interfaces under the models dir
export interface CellActionParams {
    onPressDelete: (id: number) => void;
    parentId?: number;
}

export interface CellActionWithRenderParams
    extends CellActionParams,
        ICellRendererParams {}
