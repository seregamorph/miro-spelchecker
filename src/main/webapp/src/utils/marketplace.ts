import { getParentHref } from "./browser";

export const getMarketplaceUrl = (): string => {
  const href = getParentHref() || "https://miro.com/";
  return `${href}marketplace/spellchecker`;
};
