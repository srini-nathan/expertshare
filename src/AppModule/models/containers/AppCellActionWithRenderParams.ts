import { ICellRendererParams } from "ag-grid-community";
import { AppCellActionParams } from "./AppCellActionParams";

export interface AppCellActionWithRenderParams
    extends AppCellActionParams,
        ICellRendererParams {}
