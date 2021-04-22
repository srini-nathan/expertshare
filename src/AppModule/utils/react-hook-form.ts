import { FormState } from "react-hook-form";

export const isInvalid = <T>(
    fieldName: string,
    formState: FormState<T>
): boolean => {
    const { errors } = formState;
    const field = fieldName as keyof T;
    return !!errors[field];
};

export const isValid = <T>(
    fieldName: string,
    formState: FormState<T>,
    inEditMode: boolean
): boolean => {
    const { errors, dirtyFields } = formState;
    const field = fieldName as keyof T;
    return inEditMode ? !errors[field] : dirtyFields[field] && !errors[field];
};

export const validation = <T>(
    fieldName: string,
    formState: FormState<T>,
    inEditMode: boolean
) => {
    return {
        isValid: isValid<T>(fieldName, formState, inEditMode),
        isInvalid: isInvalid<T>(fieldName, formState),
    };
};
