import { useParams } from "@reach/router";
import { useState } from "react";

export function useDataAddEdit<T>(initData: T | null = null) {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const [data, setData] = useState<T | null>(initData);
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
