import { BoardNode, Shape, StickyNote, Text } from "@mirohq/websdk-types";

// const ALL_OBJECT_TYPES = ['card', 'frame', 'image', 'preview', 'shape', 'sticky_note', 'text', 'embed', 'tag'];

export const OBJECTS_WITH_CONTENT = ["shape", "sticky_note", "text"];

export type ItemWithContent = Shape | StickyNote | Text;

export const isObjectWithContent = (
  item: BoardNode
): item is ItemWithContent => {
  return OBJECTS_WITH_CONTENT.includes(item.type);
};

export const getBoardObjectsWithContent = (
  items: BoardNode[] = []
): ItemWithContent[] => {
  return items.reduce<ItemWithContent[]>((acc, item) => {
    if (isObjectWithContent(item)) {
      return [...acc, item];
    }
    return acc;
  }, []);
};

export interface ElementContent {
  elementId: string;
  text: string;
}

export const getContentFromElements = (
  items: ItemWithContent[]
): ElementContent[] => {
  return items.reduce<ElementContent[]>((acc, item) => {
    if (!isObjectWithContent(item)) {
      return acc;
    }

    if (!item.content) {
      return acc;
    }

    return [
      ...acc,
      {
        elementId: item.id,
        text: item.content,
      },
    ];
  }, []);
};
