import { ElementContent } from "./board";
import { SupportedLanguage } from "./language";

let API_TOKEN = "";

const getApiToken = () => {
  if (API_TOKEN) {
    return Promise.resolve(API_TOKEN);
  }

  return miro.board.getIdToken().then((token) => {
    API_TOKEN = token;
    return API_TOKEN;
  });
};

export interface SpellCheckResult {
  elementId: string;
  fromPos: number;
  fromPosPlain: number;
  indexShift: number;
  toPos: number;
  toPosPlain: number;
  plainText: string; // Normalized text
  message: string; // Error explanation
  suggestedReplacements: string[];
}

export interface RequestData {
  elements: ElementContent[];
  language: SupportedLanguage;
}
export const runSpellCheckRequest = (
  payload: RequestData
): Promise<SpellCheckResult[]> => {
  const apiHost = import.meta.env.SPELLCHECK_API_HOST || document.location.href;
  const url = new URL("/spellcheck", apiHost);

  return getApiToken()
    .then((token) => {
      return fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-Miro-Token": token,
        },
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return response.json();
    });
};
