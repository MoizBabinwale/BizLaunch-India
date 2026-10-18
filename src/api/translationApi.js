import { api } from "./index";

export const translateTexts = async (texts, target) => {
  const result = await api("/translate", {
    method: "POST",
    body: JSON.stringify({ texts, target }),
  });
  return result.translations;
};
