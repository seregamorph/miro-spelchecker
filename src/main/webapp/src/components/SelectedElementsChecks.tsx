import {FC, useEffect, useMemo} from "react";
import {Item} from "@mirohq/websdk-types";
import cn from 'classnames';
import {useTrackActiveElement} from "../hooks/useTrackActiveElement";
import {useSpellCheck} from "../hooks/useSpellCheck";
import {linkChecksWithItems} from "../utils/checks";
import {List} from "./ui/lists/List";
import {SpellCheckCard} from "./SpellCheckCard/SpellCheckCard";
import {SupportedLanguage} from "../utils/language";
import {NoElementsSelected} from "./NoElementsSelected/NoElementsSelected";

interface Props {
    active: boolean;
    items: Item[];
    setItems: (items: Item[]) => void;
    switchToAll: () => void;
    onActivate: (fn: () => void) => void;
    className: string;
    language: SupportedLanguage;
}
export const SelectedElementsChecks: FC<Props> = ({ active, items, setItems, switchToAll, onActivate, className, language}) => {
    useTrackActiveElement(items, setItems);

    const {checks, refetch} = useSpellCheck(items, language);

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

        onActivate(refetch)
    }, [active, onActivate, refetch])

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
        <List className={className}>
            {list.map(({check, item}) => <li key={check.id}><SpellCheckCard check={check} item={item} hideFocus/></li>)}
        </List>
    );
}