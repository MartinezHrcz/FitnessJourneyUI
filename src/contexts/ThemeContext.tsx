import {createContext, type ReactNode, useEffect, useState} from 'react';

export interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(prev => !prev) }}>
            {children}
        </ThemeContext.Provider>
    );
};