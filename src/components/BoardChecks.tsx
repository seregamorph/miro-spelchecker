import {FC, useCallback, useEffect, useMemo, useState} from "react";
import {RefreshButton} from "./RefreshButton";
import {getBoardObjectsWithContent, OBJECTS_WITH_CONTENT} from "../utils/board";
import {useSpellCheck} from "../hooks/useSpellCheck";
import { Item } from "@mirohq/websdk-types";
import {SpellCheckCard} from "./SpellCheckCard/SpellCheckCard";
import {List} from "./ui/lists/List";
import {linkChecksWithItems} from "../utils/checks";

interface Props {
    onChange: (count: number) => void;
    active: boolean;
}
export const BoardChecks: FC<Props> = ({ active}) => {
    const [items, setItems] = useState<Item[]>([]);

    const { checks, refetch } = useSpellCheck(items);

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

    const list = useMemo(() => {
        return linkChecksWithItems(checks || [], items);
    }, [items, checks])

    if (!active) {
        return null;
    }

    return (<div className="grid">
            <List className="cs1 ce12">
                {list.map(({check, item}) => <li key={check.id}><SpellCheckCard check={check} item={item}/></li>)}
            </List>
            <RefreshButton className="cs1 ce12" onClick={onRefresh}/>
    </div>);
}