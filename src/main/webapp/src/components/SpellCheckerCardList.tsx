import {FC, useCallback, useRef} from "react";
import AutoSizer from 'react-virtualized-auto-sizer';
import {VariableSizeList, VariableSizeList as List} from 'react-window';
import {SpellCheckList} from "../utils/checks";
import {ListItem} from "./SpellCheckCard/SpellCheckCard";

interface Props {
    items: SpellCheckList[];
    className: string;
    heightShift: number;
    hideFocus?: boolean;
}
export const SpellCheckerCardList: FC<Props> = ({ className, items,hideFocus, heightShift }) => {
    const ref = useRef<VariableSizeList>(null)
    const heights = useRef<Record<string, number>>({});
    const setHeight = useCallback((index: number, height: number) => {
        heights.current = {
            ...heights.current,
            [index]: height
        }
        ref.current?.resetAfterIndex(index);
    }, []);

    const getHeight = useCallback((index: number) => {
        return heights.current[index] || 1000;
    }, []);

    return (
        <AutoSizer className={className}>
            {({ height, width }) => (
                <List
                    innerElementType="ul"
                    ref={ref}
                    height={height - heightShift}
                    width={width}
                    itemCount={items.length}
                    itemSize={getHeight}
                >
                    {({ index, style }) => (
                        <li key={index} style={style}>
                            <ListItem index={index} item={items[index]} setHeight={setHeight} hideFocus={hideFocus}/>
                        </li>
                    )}
                </List>
            )}
        </AutoSizer>
    )
}
