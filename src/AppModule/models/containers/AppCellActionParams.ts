export interface AppCellActionParams {
    onPressDelete: (id: number) => void;
    onPressClone?: (id: number) => void;
    parentId?: number;
    hideParentFromUrl?: boolean;
    isGrantedControl?: boolean;
}
