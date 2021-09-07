import { PrimitiveObject } from "./PrimitiveObject";

export interface Option<T> {
    value: T;
    label: string;
}

export interface DropDownOption extends PrimitiveObject {
    value: number;
    label: string;
}
