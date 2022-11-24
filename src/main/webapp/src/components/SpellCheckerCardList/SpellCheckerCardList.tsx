import { FC, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SpellCheckList } from "../../utils/checks";
import { SpellCheckCard } from "../SpellCheckCard/SpellCheckCard";
import { ItemWithContent } from "../../utils/board";
import styles from "./SpellCheckerCardList.module.css";

interface Props {
  items: SpellCheckList[];
  className: string;
  disabled: boolean;
  onBeforeFix?: VoidFunction;
  onAfterFix?: (item: ItemWithContent) => void;
}
export const SpellCheckerCardList: FC<Props> = ({
  className,
  items,
  disabled,
  onBeforeFix,
  onAfterFix,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 100,
  });

  return (
    <div ref={ref} className={className}>
      <ul
        className={styles.list}
        style={{
          height: virtualizer.getTotalSize(),
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <li
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className={styles.item}
            style={{
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <SpellCheckCard
              data={items[virtualRow.index]}
              disabled={disabled}
              onBeforeFix={onBeforeFix}
              onAfterFix={onAfterFix}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
