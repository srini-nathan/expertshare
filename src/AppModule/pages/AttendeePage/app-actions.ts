import { AppCellActionWithRenderParams } from "../../../AppModule/models";

export interface AppCellActionWithRenderWithCustom
    extends AppCellActionWithRenderParams {
    onPressBookSession: () => void;
    onPressGetInContact: () => void;
    onPressAddNewUser: () => void;
}

export interface AppCellActionWithCustom {
    onPressBookSession: () => void;
    onPressGetInContact: () => void;
    onPressAddNewUser: () => void;
}
