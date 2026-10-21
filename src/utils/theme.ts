export type Theme = "midnight" | "daylight";

const THEME_KEY = "imanage-theme";

/**
 * Read the persisted theme. Defaults to "midnight", which is the
 * dark glass aesthetic the app is designed around.
 */
export function getTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "daylight" ? "daylight" : "midnight";
}

/**
 * Apply the theme to <html>. The `.light` class is what the stylesheet
 * keys its Daylight overrides off.
 */
export function applyTheme(theme: Theme): void {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "daylight");
    root.style.colorScheme = theme === "daylight" ? "light" : "dark";
}

/**
 * Persist and apply. Called from Settings.
 */
export function setTheme(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
}

/**
 * Run before React mounts so the first paint is already the correct
 * theme. Doing it in an effect causes a visible flash.
 */
export function bootstrapTheme(): void {
    applyTheme(getTheme());
}
