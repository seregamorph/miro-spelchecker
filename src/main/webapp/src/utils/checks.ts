import { SpellCheckResult } from "./api";
import { AnchoredElementContent, WithAnchor } from "./extractors";

export const getFullId = ({ elementId, property }: AnchoredElementContent) =>
  `${elementId}:${property}`;

export type SpellCheckList = WithAnchor & {
  check: SpellCheckResult;
};

export const linkChecksWithItems = (
  content: AnchoredElementContent[],
  checks: SpellCheckResult[] = []
): SpellCheckList[] => {
  const anchors = content.reduce<Record<string, AnchoredElementContent>>(
    (acc, item) => {
      return {
        ...acc,
        [getFullId(item)]: item,
      };
    },
    {}
  );

  return checks.reduce<SpellCheckList[]>((acc, check) => {
    const elementContent = anchors[check.elementId];

    if (!elementContent) {
      return acc;
    }

    const { anchorId, property, elementId } = elementContent;

    return [
      ...acc,
      {
        check: {
          ...check,
          elementId,
        },
        anchorId,
        property,
      },
    ];
  }, []);
};
