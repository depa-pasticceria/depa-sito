'use client';

import { createContext, useContext } from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({ value, children }) {
	return (
		<SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
	);
}

export const useSettings = () => useContext(SettingsContext);
