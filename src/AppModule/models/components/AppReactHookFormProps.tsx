import { Control } from "react-hook-form";

export interface AppReactHookFormProps {
    name: string;
    defaultValue?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: Control<any>;
    isInvalid?: boolean;
    isValid?: boolean;
    errorMessage?: string;
}
