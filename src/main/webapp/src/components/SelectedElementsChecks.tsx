import {FC, useCallback, useEffect, useMemo} from "react";
import {Item} from "@mirohq/websdk-types";
import cn from 'classnames';
import {useTrackActiveElement} from "../hooks/useTrackActiveElement";
import {useSpellCheck} from "../hooks/useSpellCheck";
import {linkChecksWithItems} from "../utils/checks";
import {SupportedLanguage} from "../utils/language";
import {NoElementsSelected} from "./NoElementsSelected/NoElementsSelected";
import {StatusWrapper} from "./StatusWrapper/StatusWrapper";
import {SpellCheckerCardList} from "./SpellCheckerCardList/SpellCheckerCardList";
import {getBoardObjectsWithContent} from "../utils/board";
import {VoidFn} from "../utils/common";

interface Props {
    active: boolean;
    items: Item[];
    setItems: (items: Item[]) => void;
    switchToAll: VoidFn;
    onActivate: (fn: VoidFn) => void;
    className: string;
    language: SupportedLanguage;
}
export const SelectedElementsChecks: FC<Props> = ({ active, items, setItems, switchToAll, onActivate, className, language}) => {
    useTrackActiveElement(items, setItems);

    const {checks, refetch, isLoading, isError } = useSpellCheck(items, language);

    const onRefresh = useCallback(() => {
        miro.board.get({ id: items.map(({id}) => id)})
            .then(boardItems => {
                const itemsWithContent = getBoardObjectsWithContent(boardItems);
                setItems(itemsWithContent);
            })
    }, [items, setItems]);

    useEffect(() => {
        if (!items.length) {
            return;
        }
        refetch();
    }, [items, refetch]);

    useEffect(() => {
        if (!active) {
            return;
        }

        onActivate(onRefresh)
    }, [active, onActivate, onRefresh])

    const list = useMemo(() => {
        return linkChecksWithItems(checks || [], items);
    }, [items, checks])

    if (!active) {
        return null;
    }

    if (!items.length) {
        return <div className={cn('centered', className)}>
            <NoElementsSelected onSwitch={switchToAll}/>
        </div>
    }

    return (
        <StatusWrapper isError={isError} isLoading={isLoading} className={className} count={list.length}>
            <SpellCheckerCardList className={className} items={list} />
        </StatusWrapper>
    );
}