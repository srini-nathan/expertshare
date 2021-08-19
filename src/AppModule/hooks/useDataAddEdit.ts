import { useParams } from "@reach/router";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGlobalData } from "../contexts";
import { Language } from "../../AdminModule/models";
import { ContainerApi } from "../../AdminModule/apis";

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
    defaultLocale: string;
    setActiveLocale: (locale: string) => void;
    conId: number;
    conUrl: string;
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
    const { defaultLanguage, languages = [], container } = useGlobalData();
    const [defaultLocale] = useState<string>(defaultLanguage?.locale || "en");
    const [activeLocale, setActiveLocale] = useState<string>(defaultLocale);
    const containerId = container?.id || 0;
    const containerResUrl = ContainerApi.toResourceUrl(containerId);

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
        defaultLocale,
        conId: containerId,
        conUrl: containerResUrl,
    };
}
