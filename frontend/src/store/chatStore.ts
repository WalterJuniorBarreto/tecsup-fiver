import { create } from 'zustand';

interface ChatStore {
  unreadCounts: Record<string, number>;
  setInitialCounts: (counts: Record<string, number>) => void;
  incrementUnread: (chatId: string) => void;
  clearUnread: (chatId: string) => void;
  getTotalUnread: () => number;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  unreadCounts: {},
  setInitialCounts: (counts) => set({ unreadCounts: counts }),
  incrementUnread: (chatId) => set((state) => ({
    unreadCounts: { ...state.unreadCounts, [chatId]: (state.unreadCounts[chatId] || 0) + 1 }
  })),
  clearUnread: (chatId) => set((state) => ({
    unreadCounts: { ...state.unreadCounts, [chatId]: 0 }
  })),
  getTotalUnread: () => {
    const counts = get().unreadCounts;
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }
}));