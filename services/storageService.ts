
import { LLMSettings, DEFAULT_LLM_SETTINGS } from "../types";

const STORAGE_KEY = 'roteiro_pro_settings_v2';

export const saveSettingsToStorage = (settings: LLMSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings to local storage", e);
  }
};

export const loadSettingsFromStorage = (): LLMSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_LLM_SETTINGS;

    const parsed = JSON.parse(stored);
    
    // Merge with defaults to ensure new fields are present if user has old config
    return {
      ...DEFAULT_LLM_SETTINGS,
      ...parsed,
      keys: {
        ...DEFAULT_LLM_SETTINGS.keys,
        ...parsed.keys
      }
    };
  } catch (e) {
    console.error("Failed to load settings from local storage", e);
    return DEFAULT_LLM_SETTINGS;
  }
};
