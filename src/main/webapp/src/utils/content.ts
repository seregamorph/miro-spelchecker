export const normalizeContent = (content: string): string => {
  const TAGS = {
    opening: "<p>",
    closing: "</p>",
  };

  const SANITIZED_ELEMENTS = {
    left: {
      sanitized: "&lt;",
      value: "<",
    },
    right: {
      sanitized: "&gt;",
      value: ">",
    },
    amp: {
      sanitized: "&amp;",
      value: "&",
    },
  };
  return content
    .replace(new RegExp(`${TAGS.closing}${TAGS.opening}`, "g"), " ")
    .replace(new RegExp(TAGS.opening, "g"), "")
    .replace(new RegExp(TAGS.closing, "g"), "")
    .replace(
      new RegExp(SANITIZED_ELEMENTS.left.sanitized, "g"),
      SANITIZED_ELEMENTS.left.value
    )
    .replace(
      new RegExp(SANITIZED_ELEMENTS.right.sanitized, "g"),
      SANITIZED_ELEMENTS.right.value
    )
    .replace(
      new RegExp(SANITIZED_ELEMENTS.amp.sanitized, "g"),
      SANITIZED_ELEMENTS.amp.value
    );
};
