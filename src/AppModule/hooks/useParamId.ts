import { useParams } from "@reach/router";

export function useParamId() {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;

    return {
        id,
        isEditMode,
    };
}
