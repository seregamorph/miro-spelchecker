import {FC, useRef} from "react";
import {useVirtualizer} from "@tanstack/react-virtual";
import {SpellCheckList} from "../../utils/checks";
import {SpellCheckCard} from "../SpellCheckCard/SpellCheckCard";
import styles from './SpellCheckerCardList.module.css';

interface Props {
    items: SpellCheckList[];
    className: string;
    hideFocus?: boolean;
}
export const SpellCheckerCardList: FC<Props> = ({ className, items,hideFocus }) => {
    const ref = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => ref.current,
        estimateSize: () => 100,
    })

    return (
        <div ref={ref} className={className}>
            <ul className={styles.list} style={{
                height: virtualizer.getTotalSize(),
            }}>
                {virtualizer.getVirtualItems().map((virtualRow) => (
                    <li key={virtualRow.key}
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}
                        className={styles.item}
                        style={{
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        <SpellCheckCard check={items[virtualRow.index].check} item={items[virtualRow.index].item} hideFocus={hideFocus} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
