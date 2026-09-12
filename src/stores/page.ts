import { create } from "zustand";

export interface PageStoreState {
  keystrokes: string[]
  placeholderText: string
  setPlaceholderText: (text: string) => void
  clearPlaceholderText: () => void
  appendKeystroke: (keystroke: string) => void
  clearKeystrokes: () => void
}

const placeholderText = "press / to search"

export const usePageStore = create<PageStoreState>()(
  (set) => ({
    keystrokes: [],
    placeholderText,
    setPlaceholderText: (placeholderText: string) => set(() => ({ placeholderText })),
    clearPlaceholderText: () => set(() => ({ placeholderText })),
    appendKeystroke: (keystroke: string) => set((state) => ({
      keystrokes: [...state.keystrokes, keystroke]
    })),
    clearKeystrokes: () => set(() => ({ keystrokes: []}))
  })
)
