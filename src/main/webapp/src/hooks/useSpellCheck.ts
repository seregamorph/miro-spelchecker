import {useCallback, useMemo} from "react";
import useSWR from 'swr'
import {Item} from "@mirohq/websdk-types";
import {runSpellCheckRequest} from "../utils/api";
import {getContentFromElements} from "../utils/board";
import {SupportedLanguage} from "../utils/language";

export const useSpellCheck = (items: Item[], language: SupportedLanguage) => {
    const cacheKey = useMemo(() => {
        const itemsWithContent = getContentFromElements(items);
        return itemsWithContent.length ? { items: itemsWithContent, language } : null;
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