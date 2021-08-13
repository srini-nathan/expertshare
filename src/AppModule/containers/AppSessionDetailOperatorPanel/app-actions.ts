import {
    AppCellActionParams,
    AppCellActionWithRenderParams,
} from "../../models";

export interface AppCellActionWithRenderWithCustom
    extends AppCellActionWithRenderParams {
    grandParentId: number;
}

export interface AppCellActionWithCustom extends AppCellActionParams {
    grandParentId: number;
}
