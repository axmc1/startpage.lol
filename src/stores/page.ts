import { create } from "zustand";

export interface PageStoreState {
  keystrokes: string[]
  placeholderText: string
  setPlaceholderText: (text: string) => void
  appendKeystroke: (keystroke: string) => void
  clearKeystrokes: () => void
}

export const usePageStore = create<PageStoreState>()(
  (set) => ({
    keystrokes: [],
    placeholderText: "press / to search",
    setPlaceholderText: (placeholderText: string) => set(() => ({ placeholderText })),
    appendKeystroke: (keystroke: string) => set((state) => ({
      keystrokes: [...state.keystrokes, keystroke]
    })),
    clearKeystrokes: () => set(() => ({ keystrokes: []}))
  })
)
