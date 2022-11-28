import {
  AppCard,
  BoardNode,
  Card,
  Frame,
  Image,
  Shape,
  StickyNote,
  Tag,
  Text,
} from "@mirohq/websdk-types";

export interface ElementContent {
  elementId: string;
  text: string;
}

export interface WithAnchor {
  anchorId: string;
  property: string; // TODO technically it is of type keyof BoardNode (anchor) that are strings
}

export type AnchoredElementContent = ElementContent & WithAnchor;

interface ContentfulWithTags {
  elements: AnchoredElementContent[];
  tags: AnchoredElementContent[];
}

/**
 * Content extractors per Item type
 */
const getTitleData = (
  item: Card | AppCard | Frame | Image
): AnchoredElementContent[] => {
  if (!item.title) {
    return [];
  }

  return [
    {
      elementId: item.id,
      anchorId: item.id,
      text: item.title,
      property: "title",
    },
  ];
};

const getDescriptionData = (item: Card | AppCard): AnchoredElementContent[] => {
  if (!item.description) {
    return [];
  }

  return [
    {
      elementId: item.id,
      anchorId: item.id,
      text: item.description,
      property: "description",
    },
  ];
};

const getContentData = (
  item: StickyNote | Shape | Text
): AnchoredElementContent[] => {
  if (!item.content) {
    return [];
  }

  return [
    {
      elementId: item.id,
      anchorId: item.id,
      text: item.content,
      property: "content",
    },
  ];
};

const getTagsData = (
  item: Card | AppCard | StickyNote,
  tags: AnchoredElementContent[]
): AnchoredElementContent[] => {
  const savedIds = tags.map((tag) => tag.elementId);
  return item.tagIds
    .filter((tagId) => !savedIds.includes(tagId))
    .reduce<AnchoredElementContent[]>((list, tagId) => {
      const tag = {
        elementId: tagId,
        anchorId: item.id,
        text: "",
        property: "title",
      };

      return [...list, tag];
    }, []);
};

const getTagData = (
  item: Tag,
  meta: Record<string, string>
): AnchoredElementContent[] => {
  const anchorId = meta[item.id];

  if (!item.title || !anchorId) {
    return [];
  }

  return [
    {
      anchorId,
      elementId: item.id,
      text: item.title,
      property: "title",
    },
  ];
};

// Exposed utility

export const getContentFromItems = (items: BoardNode[]): ContentfulWithTags => {
  return items.reduce<ContentfulWithTags>(
    (list, item) => {
      switch (item.type) {
        case "card":
        case "app_card":
          return {
            elements: [
              ...list.elements,
              ...getTitleData(item),
              ...getDescriptionData(item),
            ],
            tags: [...list.tags, ...getTagsData(item, list.tags)],
          };
        case "frame":
        case "image":
          return {
            elements: [...list.elements, ...getTitleData(item)],
            tags: list.tags,
          };
        case "shape":
        case "text":
          return {
            elements: [...list.elements, ...getContentData(item)],
            tags: list.tags,
          };
        case "sticky_note":
          return {
            elements: [...list.elements, ...getContentData(item)],
            tags: [...list.tags, ...getTagsData(item, list.tags)],
          };
        default:
          return list;
      }
    },
    { elements: [], tags: [] }
  );
};

export const getContentFromTags = (
  items: BoardNode[],
  meta: AnchoredElementContent[]
): AnchoredElementContent[] => {
  const tagMeta = meta.reduce<Record<string, string>>((pairs, tag) => {
    return {
      ...pairs,
      [tag.elementId]: tag.anchorId,
    };
  }, {});

  return items.reduce<AnchoredElementContent[]>((list, item) => {
    switch (item.type) {
      case "tag":
        return [...list, ...getTagData(item, tagMeta)];
      default:
        return list;
    }
  }, []);
};
