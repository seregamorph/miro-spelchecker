import {FC, useCallback, useEffect, useMemo, useState} from "react";
import { Item } from "@mirohq/websdk-types";
import {getBoardObjectsWithContent, OBJECTS_WITH_CONTENT} from "../utils/board";
import {useSpellCheck} from "../hooks/useSpellCheck";
import {SpellCheckCard} from "./SpellCheckCard/SpellCheckCard";
import {List} from "./ui/lists/List";
import {linkChecksWithItems} from "../utils/checks";
import {SupportedLanguage} from "../utils/language";

interface Props {
    active: boolean;
    onActivate: (fn: () => void) => void;
    className: string;
    language: SupportedLanguage;
}
export const BoardChecks: FC<Props> = ({ active, onActivate, className, language}) => {
    const [items, setItems] = useState<Item[]>([]);

    const { checks, refetch } = useSpellCheck(items, language);

    const onRefresh = useCallback(() => {
        miro.board.get({ type: OBJECTS_WITH_CONTENT})
            .then(boardItems => {
                const itemsWithContent = getBoardObjectsWithContent(boardItems);
                setItems(itemsWithContent);
            })
    }, []);

    useEffect(() => {
        if (!active) {
            return;
        }
        onRefresh();
    }, [onRefresh, active]);

    useEffect(() => {
        refetch();
    }, [items])

    useEffect(() => {
        if (!active) {
            return;
        }

        onActivate(onRefresh);
    }, [active, onActivate, onRefresh])

    const list = useMemo(() => {
        return linkChecksWithItems(checks || [], items);
    }, [items, checks])

    if (!active) {
        return null;
    }

    return (
            <List className={className}>
                {list.map(({check, item}) => <li key={check.id}><SpellCheckCard check={check} item={item}/></li>)}
            </List>
    );
}