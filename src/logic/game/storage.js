import { STORAGE_KEYS } from "../../config/constants.js";

function readBoolean(key, fallbackValue) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallbackValue : value === "true";
  } catch {
    return fallbackValue;
  }
}

function writeValue(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    return;
  }
}

export function loadPreferences() {
  return {
    soundEnabled: readBoolean(STORAGE_KEYS.soundEnabled, true)
  };
}

export function saveSoundEnabled(enabled) {
  writeValue(STORAGE_KEYS.soundEnabled, enabled);
}

export function saveLearningHistory(summary) {
  try {
    const current = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.learningHistory) ?? "[]"
    );
    current.unshift({
      savedAt: new Date().toISOString(),
      ...summary
    });
    window.localStorage.setItem(
      STORAGE_KEYS.learningHistory,
      JSON.stringify(current.slice(0, 10))
    );
  } catch {
    return;
  }
}
