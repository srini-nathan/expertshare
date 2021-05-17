import { isString, startCase } from "lodash";

export function useInputPlaceholder(
    name: string,
    placeholder?: string | boolean,
    label?: string
) {
    return isString(placeholder)
        ? placeholder
        : `Enter ${startCase(label) || startCase(name)}`;
}
