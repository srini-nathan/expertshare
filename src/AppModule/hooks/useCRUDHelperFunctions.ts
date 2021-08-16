import { useTranslation } from "react-i18next";
import { EntityAPI } from "../apis";
import { errorToast, successToast } from "../utils";

type FunctionMetaData = {
    success?: string;
    onSuccess?: <T>(data?: T) => void;
    error?: string;
    onError?: () => void;
    onCleanup?: () => void;
};

type UseCRUDHelperFunctionsType = {
    handleDeleteById: (id: number, metaData?: FunctionMetaData) => void;
};

export function useCRUDHelperFunctions(
    emRef: typeof EntityAPI
): UseCRUDHelperFunctionsType {
    const entityManager: typeof EntityAPI = emRef;
    const { t } = useTranslation();

    const handleDeleteById = (id: number, metaData: FunctionMetaData = {}) => {
        const {
            success,
            error: customErrorMsg,
            onSuccess,
            onError,
            onCleanup,
        } = metaData;
        entityManager
            .deleteById(id)
            .then(({ error, errorMessage }) => {
                if (error !== null) {
                    errorToast(t(customErrorMsg || errorMessage));
                    if (onError) {
                        onError();
                    }
                } else {
                    if (success) {
                        successToast(t(success));
                    }
                    if (onSuccess) {
                        onSuccess();
                    }
                }
            })
            .catch(() => {
                if (onError) {
                    onError();
                }
            })
            .finally(() => {
                if (onCleanup) {
                    onCleanup();
                }
            });
    };
    return {
        handleDeleteById,
    };
}
