import { create } from "zustand"

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("fluently-theme") || "forest",
    setTheme: (theme) => {
        localStorage.setItem("fluently-theme", theme)
        set({theme})
    }
}))