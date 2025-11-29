import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import type { Chat, ChatMessage } from '@repo/types';
import { nanoid } from 'nanoid';

interface ChatContextType {
    // Chat management
    chats: Chat[];
    currentChat: Chat | null;
    createChat: () => Promise<Chat>;
    setCurrentChat: (chat: Chat | null) => void;
    updateChat: (chatId: string, updates: Partial<Chat>) => void;
    deleteChat: (chatId: string) => void;
    getChatById: (chatId: string) => Chat | undefined;

    // Message management
    addMessageToChat: (chatId: string, message: ChatMessage) => void;
    updateChatMessages: (chatId: string, messages: ChatMessage[]) => void;
    generateChatTitle: (chatId: string, messages: ChatMessage[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
    
    // Refs to prevent infinite loops
    const isLoadingRef = useRef(false);
    const lastSavedChatsRef = useRef<string>('');

    // Load chats from localStorage on mount
    useEffect(() => {
        const savedChats = localStorage.getItem('operone-chats');
        if (savedChats) {
            try {
                const parsed = JSON.parse(savedChats);
                setChats(parsed.map((chat: any) => ({
                    ...chat,
                    createdAt: new Date(chat.createdAt),
                    updatedAt: new Date(chat.updatedAt),
                    messages: (chat.messages || []).map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                })));
            } catch (error) {
                console.error('Failed to load chats:', error);
            }
        }
    }, []);

    // Save chats to localStorage whenever they change (with debouncing and loop prevention)
    useEffect(() => {
        if (chats.length === 0 || isLoadingRef.current) return;
        
        const currentChatsString = JSON.stringify(chats);
        if (currentChatsString === lastSavedChatsRef.current) return;
        
        const timeoutId = setTimeout(() => {
            try {
                localStorage.setItem('operone-chats', currentChatsString);
                lastSavedChatsRef.current = currentChatsString;
            } catch (error) {
                console.error('Failed to save chats:', error);
            }
        }, 500); // 500ms debounce
        
        return () => clearTimeout(timeoutId);
    }, [chats]);

    const createChat = useCallback(async (): Promise<Chat> => {
        const newChat: Chat = {
            id: nanoid(),
            title: 'New Chat',
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: []
        };

        setChats(prev => [newChat, ...prev]);
        setCurrentChatState(newChat);
        return newChat;
    }, []);

    const setCurrentChat = useCallback((chat: Chat | null) => {
        setCurrentChatState(chat);
    }, []);

    const updateChat = useCallback((chatId: string, updates: Partial<Chat>) => {
        setChats(prev => {
            const updated = prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, ...updates, updatedAt: new Date() }
                    : chat
            );
            return updated;
        });

        // Update current chat if it's the one being updated
        setCurrentChatState(prev => {
            if (prev?.id === chatId) {
                return { ...prev, ...updates, updatedAt: new Date() };
            }
            return prev;
        });
    }, []);

    const deleteChat = useCallback((chatId: string) => {
        setChats(prev => prev.filter(c => c.id !== chatId));
        setCurrentChatState(prev => prev?.id === chatId ? null : prev);
    }, []);

    const getChatById = useCallback((chatId: string) => {
        return chats.find(chat => chat.id === chatId);
    }, [chats]);

    const addMessageToChat = useCallback((chatId: string, message: ChatMessage) => {
        setChats(prev => prev.map(chat =>
            chat.id === chatId
                ? {
                    ...chat,
                    messages: [...(chat.messages || []), message],
                    updatedAt: new Date()
                }
                : chat
        ));

        // Update current chat if it's the one being updated
        setCurrentChatState(prev =>
            prev?.id === chatId
                ? {
                    ...prev,
                    messages: [...(prev.messages || []), message],
                    updatedAt: new Date()
                }
                : prev
        );
    }, []);

    const updateChatMessages = useCallback((chatId: string, messages: ChatMessage[]) => {
        setChats(prev => {
            const updated = prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, messages, updatedAt: new Date() }
                    : chat
            );
            return updated;
        });

        // Only update current chat if messages actually changed
        setCurrentChatState(prev => {
            if (prev?.id === chatId) {
                const currentMessages = prev.messages || [];
                const messagesChanged = messages.length !== currentMessages.length ||
                    messages.some((msg, idx) => {
                        const currentMsg = currentMessages[idx];
                        return msg.id !== currentMsg?.id || msg.content !== currentMsg?.content;
                    });
                
                if (messagesChanged) {
                    return { ...prev, messages, updatedAt: new Date() };
                }
            }
            return prev;
        });
    }, []);

    const generateChatTitle = useCallback((chatId: string, messages: ChatMessage[]) => {
        const firstMessage = messages.find(m => m.role === 'user');
        if (firstMessage && firstMessage.content) {
            const title = firstMessage.content.slice(0, 40) + (firstMessage.content.length > 40 ? '...' : '');
            updateChat(chatId, { title });
        }
    }, [updateChat]);

    const value: ChatContextType = {
        chats,
        currentChat,
        createChat,
        setCurrentChat,
        updateChat,
        deleteChat,
        getChatById,
        addMessageToChat,
        updateChatMessages,
        generateChatTitle
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
}
