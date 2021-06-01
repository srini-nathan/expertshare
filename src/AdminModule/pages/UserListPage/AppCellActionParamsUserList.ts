import { AppCellActionParams } from "../../../AppModule/models";

export interface AppCellActionParamsUserList extends AppCellActionParams {
    onCheckHeaderCheckbox: () => void;
    onCheckCheckbox: (id: number) => void;
    onSelectChange: (id: number, role: string) => void;
    selectedUserList: number[];
}
