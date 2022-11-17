import {useCallback} from "react";
import useSWR from 'swr'
import {Item} from "@mirohq/websdk-types";
import {runSpellCheckRequest} from "../utils/api";
import {getContentFromElements} from "../utils/board";

export const useSpellCheck = (items: Item[]) => {
    const itemsWithContent = getContentFromElements(items);
    const cacheKey = itemsWithContent.length ? { items: itemsWithContent } : null;
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