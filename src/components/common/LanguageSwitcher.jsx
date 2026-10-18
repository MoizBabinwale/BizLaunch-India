import { Languages } from "lucide-react";
import { LANGUAGES, useLanguage } from "../../context/LanguageContext";

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, translationError } = useLanguage();

  return (
    <div className="flex flex-col items-start gap-1">
      <label className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary">
        <Languages size={16} aria-hidden="true" />
        <span className={compact ? "sr-only" : ""}>Language</span>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          aria-label="Choose website language"
          className="rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        >
          {LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>{item.label}</option>
          ))}
        </select>
      </label>
      {translationError && (
        <span role="status" className="max-w-64 text-xs text-amber-800">
          {translationError}
        </span>
      )}
    </div>
  );
}
