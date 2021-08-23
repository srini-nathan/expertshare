import { useParams } from "@reach/router";
import { useState } from "react";

type DataAddEditReturnType<T> = {
    id: null | number;
    isEditMode: boolean;
    isLoading: boolean;
    data: T;
    setIsLoading: (status: boolean) => void;
    setData: (data: T) => void;
};

export function useAddEditPage<T>(initData: T): DataAddEditReturnType<T> {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const [data, setData] = useState<T>(initData);
    const [isLoading, setIsLoading] = useState<boolean>(isEditMode);

    return {
        id,
        isEditMode,
        data,
        setData,
        isLoading,
        setIsLoading,
    };
}
