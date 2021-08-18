import { useParams } from "@reach/router";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGlobalData } from "../contexts";
import { Language } from "../../AdminModule/models";

type DataAddEditReturnType<T> = {
    id: null | number;
    isEditMode: boolean;
    isLoading: boolean;
    data: T;
    setIsLoading: (status: boolean) => void;
    setData: (data: T) => void;
    hookForm: UseFormReturn<T>;
    languages: Language[];
    activeLocale: string;
    setActiveLocale: (locale: string) => void;
};

export function useDataAddEdit<T>(
    initData: T,
    schema?: any
): DataAddEditReturnType<T> {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const [data, setData] = useState<T>(initData);
    const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
    const hookForm = useForm<T>({
        resolver: schema ? yupResolver(schema) : undefined,
        mode: "all",
    });
    const { defaultLanguage, languages = [] } = useGlobalData();
    const [defaultLocale] = useState<string>(defaultLanguage?.locale || "en");
    const [activeLocale, setActiveLocale] = useState<string>(defaultLocale);

    return {
        id,
        isEditMode,
        data,
        setData,
        isLoading,
        setIsLoading,
        hookForm,
        languages,
        activeLocale,
        setActiveLocale,
    };
}
