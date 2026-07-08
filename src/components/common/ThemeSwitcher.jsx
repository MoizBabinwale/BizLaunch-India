import React from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = () => {
  // TODO: Implement theme switching logic (e.g., using context and localStorage)
  const isDarkMode = false;

  return <button className="p-2 rounded-full hover:bg-gray-200">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>;
};

export default ThemeSwitcher;
