import React, { createContext, useState, useEffect, useCallback } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface II18nContext {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    direction: 'ltr' | 'rtl';
    isLoaded: boolean;
}

export const I18nContext = createContext<II18nContext>({} as II18nContext);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('fr');
    const [messages, setMessages] = useState<Record<string, any> | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const direction: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

    // Function to load translations using fetch
    const loadTranslations = async (lang: Language) => {
        setIsLoaded(false);
        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error(`Failed to load translations for ${lang}`, error);
            // Fallback to English if loading fails
            try {
                const response = await fetch('/locales/fr.json');
                 if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMessages(data);
                setLanguage('fr');
            } catch (fallbackError) {
                console.error('CRITICAL: Failed to load fallback French translations.', fallbackError);
                setMessages({}); // Set empty messages to avoid crashing
            }
        } finally {
            setIsLoaded(true);
        }
    };

    // Effect to detect browser language on initial load
    useEffect(() => {
        const browserLang = navigator.language.split('-')[0] as Language;
        const initialLang = ['en', 'fr', 'ar'].includes(browserLang) ? browserLang : 'fr';
        setLanguage(initialLang);
    }, []);
    
    // Effect to load translations when language changes
    useEffect(() => {
        loadTranslations(language);
    }, [language]);

    // Effect to update document attributes
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = direction;
    }, [language, direction]);
    
    const t = useCallback((key: string): string => {
        if (!messages) {
            return key; // Return the key itself if messages are not loaded
        }
        
        if (messages && typeof messages === 'object' && key in messages) {
            return messages[key];
        }
        
        return key; // Return key if not found
    }, [messages]);


    const value = {
        language,
        setLanguage,
        t,
        direction,
        isLoaded
    };

    // Render children only when initial translations are loaded to prevent UI flicker
    return (
        <I18nContext.Provider value={value}>
            {isLoaded ? children : null}
        </I18nContext.Provider>
    );
};