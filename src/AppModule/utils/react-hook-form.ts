import { FormState } from "react-hook-form";
import { get } from "lodash";

export const isInvalid = <T>(
    fieldName: string,
    formState: FormState<T>
): boolean => {
    const { errors } = formState;
    const field = fieldName as keyof T;
    return !!get(errors, field);
};

export const isValid = <T>(
    fieldName: string,
    formState: FormState<T>,
    inEditMode: boolean
): boolean => {
    const { errors, dirtyFields } = formState;
    const field = fieldName as keyof T;
    return inEditMode
        ? !get(errors, field)
        : get(dirtyFields, field) && !get(errors, field);
};

export const errorMessage = <T>(
    fieldName: string,
    formState: FormState<T>
): string => {
    const { errors } = formState;
    const field = fieldName as keyof T;
    return get(errors, `${field}.message`);
};

export const validation = <T>(
    fieldName: string,
    formState: FormState<T>,
    inEditMode: boolean,
    wantErrorMsg = false
) => {
    if (!wantErrorMsg) {
        return {
            isValid: isValid<T>(fieldName, formState, inEditMode),
            isInvalid: isInvalid<T>(fieldName, formState),
        };
    }
    return {
        errorMessage: errorMessage<T>(fieldName, formState),
        isValid: isValid<T>(fieldName, formState, inEditMode),
        isInvalid: isInvalid<T>(fieldName, formState),
    };
};
