import { BoardNode, GetFilter } from "@mirohq/websdk-types";
import { runSpellCheckRequest } from "./api";
import { getFullId, linkChecksWithItems } from "./checks";
import { SupportedLanguage } from "./language";
import {
  getContentFromItems,
  getContentFromTags,
  ElementContent,
} from "./extractors";

export const runBoardSpellCheck = async (language: SupportedLanguage) => {
  return runSpellCheck(language);
};

export const runElementsSpellCHeck = async (
  language: SupportedLanguage,
  items: BoardNode[]
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
  filter?: GetFilter
) => {
  const boardItems = await miro.board.get(filter);
  const { elements, tags: tagElements } = getContentFromItems(boardItems);

  const tagFilter: GetFilter = {
    id: tagElements.map(({ elementId }) => elementId),
  };
  const boardTags = await miro.board.get(tagFilter);
  const tags = getContentFromTags(boardTags, tagElements);
  const content = [...elements, ...tags];
  if (!content.length) {
    return [];
  }

  const requestData: ElementContent[] = content.map((elementContent) => {
    return {
      elementId: getFullId(elementContent),
      text: elementContent.text,
    };
  });

  const checks = await runSpellCheckRequest(requestData, language);
  return linkChecksWithItems(content, checks);
};
