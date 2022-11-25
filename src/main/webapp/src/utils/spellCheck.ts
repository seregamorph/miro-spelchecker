import { GetFilter } from "@mirohq/websdk-types";
import {
  getBoardObjectsWithContent,
  getContentFromElements,
  ItemWithContent,
  OBJECTS_WITH_CONTENT,
} from "./board";
import { runSpellCheckRequest } from "./api";
import { linkChecksWithItems } from "./checks";
import { SupportedLanguage } from "./language";

export const runBoardSpellCheck = async (language: SupportedLanguage) => {
  const filter = { type: OBJECTS_WITH_CONTENT };
  return runSpellCheck(language, filter);
};

export const runElementsSpellCHeck = async (
  language: SupportedLanguage,
  items: ItemWithContent[]
) => {
  if (!items.length) {
    return [];
  }

  const filter = {
    id: items.map(({ id }) => id),
  };
  return runSpellCheck(language, filter);
};

const runSpellCheck = async (
  language: SupportedLanguage,
  filter: GetFilter
) => {
  const boardItems = await miro.board.get(filter);
  const itemsWithContent = getBoardObjectsWithContent(boardItems);
  const content = getContentFromElements(itemsWithContent);
  if (!content.length) {
    return [];
  }
  const newChecks = await runSpellCheckRequest({ language, elements: content });
  return linkChecksWithItems(itemsWithContent, newChecks);
};
