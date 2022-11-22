import { BoardNode, Item, Shape, StickyNote, Text } from "@mirohq/websdk-types";

// const ALL_OBJECT_TYPES = ['card', 'frame', 'image', 'preview', 'shape', 'sticky_note', 'text', 'embed', 'tag'];

export const OBJECTS_WITH_CONTENT = ["shape", "sticky_note", "text"];

export const isObjectWithContent = (
  item: BoardNode
): item is Shape | StickyNote | Text => {
  return OBJECTS_WITH_CONTENT.includes(item.type);
};

export const getBoardObjectsWithContent = (items: BoardNode[]): Item[] => {
  return items.reduce<Item[]>((acc, item) => {
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

export const getContentFromElements = (items: Item[]): ElementContent[] => {
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
