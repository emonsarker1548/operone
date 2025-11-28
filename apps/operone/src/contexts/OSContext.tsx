import React, { createContext, useContext, useCallback } from 'react';

interface OSContextType {
    fs: {
        read: (path: string) => Promise<string>;
        write: (path: string, content: string) => Promise<void>;
        list: (path: string) => Promise<string[]>;
    };
    shell: {
        execute: (command: string, args: string[]) => Promise<any>;
    };
    system: {
        getMetrics: () => Promise<any>;
    };
}

const OSContext = createContext<OSContextType | null>(null);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Access the exposed electronAPI
    const api = (window as any).electronAPI;

    const fs = {
        read: useCallback((path: string) => api.fs.read(path), [api]),
        write: useCallback((path: string, content: string) => api.fs.write(path, content), [api]),
        list: useCallback((path: string) => api.fs.list(path), [api]),
    };

    const shell = {
        execute: useCallback((command: string, args: string[]) => api.shell.execute(command, args), [api]),
    };

    const system = {
        getMetrics: useCallback(() => api.system.getMetrics(), [api]),
    };

    return (
        <OSContext.Provider value={{ fs, shell, system }}>
            {children}
        </OSContext.Provider>
    );
};

export const useOS = () => {
    const context = useContext(OSContext);
    if (!context) {
        throw new Error('useOS must be used within an OSProvider');
    }
    return context;
};
