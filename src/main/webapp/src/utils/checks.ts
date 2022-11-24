import { SpellCheckResult } from "./api";
import { ItemWithContent } from "./board";

export interface SpellCheckList {
  check: SpellCheckResult;
  item: ItemWithContent;
}
export const linkChecksWithItems = (
  items: ItemWithContent[],
  checks: SpellCheckResult[] = []
): SpellCheckList[] => {
  const itemsObj = items.reduce<{ [id: string]: ItemWithContent }>(
    (acc, item) => {
      return {
        ...acc,
        [item.id]: item,
      };
    },
    {}
  );

  return checks.reduce<SpellCheckList[]>((acc, check) => {
    const relatedItem = itemsObj[check.elementId];
    if (!relatedItem) {
      return acc;
    }

    return [
      ...acc,
      {
        check,
        item: relatedItem,
      },
    ];
  }, []);
};

export const applySuggestion = async (
  item: ItemWithContent,
  check: SpellCheckResult,
  suggestion: string
) => {
  const fromPos = check.fromPos;
  const toPos = check.toPos;

  item.content = [
    item.content.slice(0, fromPos),
    suggestion,
    item.content.slice(toPos),
  ].join("");

  await item.sync();
  return item;
};
