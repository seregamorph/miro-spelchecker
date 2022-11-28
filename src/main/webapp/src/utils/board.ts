import { SpellCheckResult } from "./api";

export const applySuggestion = async (
  property: string,
  check: SpellCheckResult,
  suggestion: string
) => {
  const fromPos = check.fromPos;
  const toPos = check.toPos;
  const elements = await miro.board.get({ id: check.elementId });
  const element = elements.shift();
  if (!element) {
    return;
  }

  // @ts-expect-error Properly typecheck the property
  element[property] = [
    // @ts-expect-error Properly typecheck the property
    element[property].slice(0, fromPos),
    suggestion,
    // @ts-expect-error Properly typecheck the property
    element[property].slice(toPos),
  ].join("");

  await element.sync();
  return element;
};

export const zoomToElement = async (elementId: string): Promise<void> => {
  const elements = await miro.board.get({ id: elementId });
  const element = elements.shift();
  if (!element || element.type === "tag") {
    throw new Error("Unsupported element for zooming");
  }
  await miro.board.viewport.zoomTo(element);
};
