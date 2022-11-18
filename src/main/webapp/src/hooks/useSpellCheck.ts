import {useCallback, useMemo} from "react";
import useSWR from 'swr'
import {Item} from "@mirohq/websdk-types";
import {RequestData, runSpellCheckRequest} from "../utils/api";
import {getContentFromElements} from "../utils/board";
import {SupportedLanguage} from "../utils/language";

export const useSpellCheck = (items: Item[], language: SupportedLanguage) => {
    const cacheKey = useMemo((): RequestData | null => {
        const itemsWithContent = getContentFromElements(items);
        return itemsWithContent.length ? { elements: itemsWithContent, language } : null;
    }, [items, language])

    const { data, error, mutate } = useSWR(cacheKey, runSpellCheckRequest)

    const refetch = useCallback(() => {
        if (!cacheKey) {
            return;
        }
        mutate()
    }, [mutate, cacheKey]);

    return {
        checks: data,
        isLoading: !error && !data,
        isError: error,
        refetch
    }
}