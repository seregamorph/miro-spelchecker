import {FC, useEffect, useMemo} from "react";
import {Item} from "@mirohq/websdk-types";
import {RefreshButton} from "./RefreshButton";
import {Button} from "./ui/Button";
import {useTrackActiveElement} from "../hooks/useTrackActiveElement";
import {useSpellCheck} from "../hooks/useSpellCheck";
import {linkChecksWithItems} from "../utils/checks";
import {List} from "./ui/lists/List";
import {SpellCheckCard} from "./SpellCheckCard/SpellCheckCard";

interface Props {
    onChange: (count: number) => void;
    active: boolean;
    items: Item[];
    setItems: (items: Item[]) => void;
    switchToAll: () => void;
}
export const SelectedElementsChecks: FC<Props> = ({ active, onChange, items, setItems, switchToAll}) => {
    useTrackActiveElement(items, setItems);

    const {checks, refetch} = useSpellCheck(items);

    useEffect(() => {
        if (!items.length) {
            onChange(0);
            return;
        }
        refetch();
    }, [items, refetch, onChange])

    const list = useMemo(() => {
        return linkChecksWithItems(checks || [], items);
    }, [items, checks])

    if (!active) {
        return null;
    }

    if (!items.length) {
        return <div className="grid">
            <p className="centered p-medium cs1 ce12">
                Nothing is selected on the board
            </p>
            <p className="centered cs1 ce12">
                <Button onClick={switchToAll} type="tertiary" size="medium">Check all board</Button>
            </p>
        </div>

    }

    return (<div className="grid">
        <List className="cs1 ce12">
            {list.map(({check, item}) => <li key={check.id}><SpellCheckCard check={check} item={item} hideFocus/></li>)}
        </List>
        <RefreshButton className="cs1 ce12" onClick={refetch}/>
    </div>);
}