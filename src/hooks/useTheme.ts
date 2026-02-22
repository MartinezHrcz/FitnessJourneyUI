import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from '../contexts/ThemeContext';

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('An error occurred using the ThemeProvider');
    }
    return context;
};