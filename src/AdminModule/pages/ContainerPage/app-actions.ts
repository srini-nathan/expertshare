import {
    AppCellActionParams,
    AppCellActionWithRenderParams,
} from "../../../AppModule/models";

export interface AppCellActionWithRenderWithCustom
    extends AppCellActionWithRenderParams {
    onPressClone: (id: number) => void;
}

export interface AppCellActionWithCustom extends AppCellActionParams {
    onPressClone: (id: number) => void;
}
