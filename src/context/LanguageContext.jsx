import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { translateTexts } from "../api/translationApi";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
];

const LANGUAGE_STORAGE_KEY = "bizlaunch-language";
const TRANSLATION_CACHE_KEY = "bizlaunch-translations-v1";
const TEXT_BATCH_SIZE = 30;
const EXCLUDED_ELEMENTS = "script,style,noscript,textarea,select,option,code,pre,[contenteditable='true'],svg,.leaflet-container";
const LanguageContext = createContext(null);

const readStoredLanguage = () => {
  try {
    const language = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LANGUAGES.some((item) => item.code === language) ? language : "en";
  } catch (_error) {
    return "en";
  }
};

const readTranslationCache = () => {
  try {
    const cache = JSON.parse(localStorage.getItem(TRANSLATION_CACHE_KEY) || "{}");
    return cache && typeof cache === "object" && !Array.isArray(cache) ? cache : {};
  } catch (_error) {
    return {};
  }
};

const cacheKey = (language, text) => `${language}:${text}`;

const shouldTranslate = (text) =>
  text.length > 1 &&
  text.length <= 3000 &&
  /[\p{L}]/u.test(text) &&
  !/^[\s\d.,:;!?()[\]{}%+\-/]+$/.test(text);

const splitWhitespace = (value) => {
  const match = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
  return { leading: match[1], text: match[2], trailing: match[3] };
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(readStoredLanguage);
  const [translationError, setTranslationError] = useState("");
  const textStates = useRef(new WeakMap());
  const attributeStates = useRef(new WeakMap());
  const cache = useRef(readTranslationCache());
  const inFlight = useRef(new Set());
  const failedTranslations = useRef(new Set());
  const generation = useRef(0);

  const setLanguage = useCallback((nextLanguage) => {
    if (!LANGUAGES.some((item) => item.code === nextLanguage)) {
      throw new Error(`Unsupported language: ${nextLanguage}`);
    }
    setTranslationError("");
    failedTranslations.current.clear();
    setLanguageState(nextLanguage);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (_error) {
      setTranslationError("Your language preference could not be saved in this browser.");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    generation.current += 1;
    const currentGeneration = generation.current;
    let observer;
    let scheduled = false;

    const applyTextTranslations = async (nodes) => {
      const work = [];
      for (const node of nodes) {
        const currentText = node.nodeValue || "";
        let state = textStates.current.get(node);
        if (!state) {
          state = { original: currentText, translated: new Map() };
          textStates.current.set(node, state);
        } else if (
          currentText !== state.original &&
          !Array.from(state.translated.values()).includes(currentText)
        ) {
          state.original = currentText;
          state.translated.clear();
        }

        const { leading, text, trailing } = splitWhitespace(state.original);
        if (language === "en") {
          if (currentText !== state.original) node.nodeValue = state.original;
          continue;
        }
        if (!shouldTranslate(text)) continue;

        const key = cacheKey(language, text);
        if (cache.current[key]) {
          const translated = `${leading}${cache.current[key]}${trailing}`;
          state.translated.set(language, translated);
          if (node.nodeValue !== translated) node.nodeValue = translated;
        } else {
          work.push({ node, state, leading, text, trailing, key });
        }
      }

      const pending = work.filter(
        (item) => !inFlight.current.has(item.key) && !failedTranslations.current.has(item.key)
      );
      if (!pending.length) return;
      const uniqueTexts = [...new Set(pending.map((item) => item.text))];
      uniqueTexts.forEach((text) => inFlight.current.add(cacheKey(language, text)));

      try {
        for (let offset = 0; offset < uniqueTexts.length; offset += TEXT_BATCH_SIZE) {
          const batch = uniqueTexts.slice(offset, offset + TEXT_BATCH_SIZE);
          const translatedBatch = await translateTexts(batch, language);
          if (translatedBatch.length !== batch.length) {
            throw new Error("Translation service returned an incomplete response.");
          }
          translatedBatch.forEach((translated, index) => {
            cache.current[cacheKey(language, batch[index])] = translated;
          });
          try {
            const entries = Object.entries(cache.current);
            if (entries.length > 4000) cache.current = Object.fromEntries(entries.slice(-3000));
            localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache.current));
          } catch (_error) {
            setTranslationError("Translations are working, but could not be cached in this browser.");
          }

          if (generation.current === currentGeneration) {
            for (const item of pending) {
              if (!batch.includes(item.text) || !item.node.isConnected) continue;
              const translated = `${item.leading}${cache.current[cacheKey(language, item.text)]}${item.trailing}`;
              item.state.translated.set(language, translated);
              if (item.node.nodeValue === item.state.original) item.node.nodeValue = translated;
            }
          }
        }
      } catch (reason) {
        uniqueTexts.forEach((text) => failedTranslations.current.add(cacheKey(language, text)));
        if (generation.current === currentGeneration) {
          setTranslationError(reason.message || "The selected language could not be loaded.");
        }
      } finally {
        uniqueTexts.forEach((text) => inFlight.current.delete(cacheKey(language, text)));
      }
    };

    const applyAttributeTranslations = async (elements) => {
      const attributes = ["placeholder", "title", "aria-label"];
      const work = [];
      for (const element of elements) {
        if (element.closest(EXCLUDED_ELEMENTS)) continue;
        let states = attributeStates.current.get(element);
        if (!states) {
          states = new Map();
          attributeStates.current.set(element, states);
        }
        for (const attribute of attributes) {
          const currentValue = element.getAttribute(attribute);
          if (!currentValue) continue;
          let state = states.get(attribute);
          if (!state) {
            state = { original: currentValue, translated: new Map() };
            states.set(attribute, state);
          } else if (
            currentValue !== state.original &&
            !Array.from(state.translated.values()).includes(currentValue)
          ) {
            state.original = currentValue;
            state.translated.clear();
          }

          if (language === "en") {
            if (currentValue !== state.original) element.setAttribute(attribute, state.original);
          } else if (shouldTranslate(state.original)) {
            const key = cacheKey(language, state.original);
            if (cache.current[key]) {
              state.translated.set(language, cache.current[key]);
              if (currentValue !== cache.current[key]) element.setAttribute(attribute, cache.current[key]);
            } else {
              work.push({ element, attribute, state, key, text: state.original });
            }
          }
        }
      }

      const pending = work.filter(
        (item) => !inFlight.current.has(item.key) && !failedTranslations.current.has(item.key)
      );
      const uniqueTexts = [...new Set(pending.map((item) => item.text))];
      if (!uniqueTexts.length) return;
      uniqueTexts.forEach((text) => inFlight.current.add(cacheKey(language, text)));
      try {
        for (let offset = 0; offset < uniqueTexts.length; offset += TEXT_BATCH_SIZE) {
          const batch = uniqueTexts.slice(offset, offset + TEXT_BATCH_SIZE);
          const translatedBatch = await translateTexts(batch, language);
          translatedBatch.forEach((translated, index) => {
            cache.current[cacheKey(language, batch[index])] = translated;
          });
          try {
            localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache.current));
          } catch (_error) {
            setTranslationError("Translations are working, but could not be cached in this browser.");
          }
          if (generation.current === currentGeneration) {
            for (const item of pending) {
              const translated = cache.current[cacheKey(language, item.text)];
              if (!translated || !item.element.isConnected) continue;
              item.state.translated.set(language, translated);
              if (item.element.getAttribute(item.attribute) === item.state.original) {
                item.element.setAttribute(item.attribute, translated);
              }
            }
          }
        }
      } catch (reason) {
        uniqueTexts.forEach((text) => failedTranslations.current.add(cacheKey(language, text)));
        if (generation.current === currentGeneration) {
          setTranslationError(reason.message || "The selected language could not be loaded.");
        }
      } finally {
        uniqueTexts.forEach((text) => inFlight.current.delete(cacheKey(language, text)));
      }
    };

    const translateDocument = () => {
      scheduled = false;
      if (!document.body) return;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (node.parentElement?.closest(EXCLUDED_ELEMENTS)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const textNodes = [];
      let node = walker.nextNode();
      while (node) {
        textNodes.push(node);
        node = walker.nextNode();
      }
      const elements = [document.body, ...document.body.querySelectorAll("*")];
      applyTextTranslations(textNodes);
      applyAttributeTranslations(elements);
    };

    const scheduleTranslation = () => {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(translateDocument, 40);
    };

    scheduleTranslation();
    observer = new MutationObserver(scheduleTranslation);
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });

    return () => {
      observer?.disconnect();
      generation.current += 1;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translationError }}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = { children: PropTypes.node.isRequired };

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
};
