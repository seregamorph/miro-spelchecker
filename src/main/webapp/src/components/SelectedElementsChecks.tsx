import {FC, useEffect, useMemo} from "react";
import {Item} from "@mirohq/websdk-types";
import cn from 'classnames';
import {Button} from "./ui/Button";
import {useTrackActiveElement} from "../hooks/useTrackActiveElement";
import {useSpellCheck} from "../hooks/useSpellCheck";
import {linkChecksWithItems} from "../utils/checks";
import {List} from "./ui/lists/List";
import {SpellCheckCard} from "./SpellCheckCard/SpellCheckCard";

interface Props {
    active: boolean;
    items: Item[];
    setItems: (items: Item[]) => void;
    switchToAll: () => void;
    onActivate: (fn: () => void) => void;
    className: string;
}
export const SelectedElementsChecks: FC<Props> = ({ active, items, setItems, switchToAll, onActivate, className}) => {
    useTrackActiveElement(items, setItems);

    const {checks, refetch} = useSpellCheck(items);

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
            <p className="p-medium">
                Nothing is selected on the board
            </p>
            <p>
                <Button onClick={switchToAll} type="secondary" size="medium">Check all elements</Button>
            </p>
        </div>
    }

    return (
        <List className={className}>
            {list.map(({check, item}) => <li key={check.id}><SpellCheckCard check={check} item={item} hideFocus/></li>)}
        </List>
    );
}