import {
    AppCellActionParams,
    AppCellActionWithRenderParams,
} from "../../../AppModule/models";

export interface AppCellActionWithRenderWithCustom
    extends AppCellActionWithRenderParams {
    onPressExport: (locale: string) => void;
}

export interface AppCellActionWithCustom extends AppCellActionParams {
    onPressExport: (locale: string) => void;
}
