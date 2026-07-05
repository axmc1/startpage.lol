import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bookmark, SearchEngine, StartpageConfig } from "../types";

export interface DataStoreState {
  data: StartpageConfig;
  setData: (data: StartpageConfig) => void;
  addHeaderText: (text: string) => void;
  addBookmark: (bookmark: Bookmark) => void;
  setSearchEngine: (searchEngine: SearchEngine) => void;
  getRandomHeaderText: () => string;
}

export const useDataStore = create<DataStoreState>()(
  persist(
    (set, get) => ({
      data: {
        headerTexts: ["don't push on fridays", "{{header_text}}"],
        bookmarks: [
          {
            id: "1",
            name: "hackernews",
            url: "https://news.ycombinator.com/",
            icon: "https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/hacker-news.svg",
            shortcut: ["h", "n"],
          },
          {
            id: "2",
            name: "github",
            url: "https://github.com/",
            icon: "https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/github.svg",
            shortcut: ["g", "h"],
          },
          {
            id: "3",
            name: "mdn",
            url: "https://developer.mozilla.org/",
            icon: "https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/mdn.svg",
            shortcut: ["m", "d", "n"],
          },
        ],
        searchEngine: {
          name: "Brave Search",
          url: "https://search.brave.com/search?q=%s",
        },
      },
      setData: (data: StartpageConfig) => set(() => ({ data })),
      addHeaderText: (text: string) => set((state) => ({
        data: { ...state.data, headerTexts: [...state.data.headerTexts, text] },
      })),
      addBookmark: (bookmark: Bookmark) => set((state) => ({
        data: { ...state.data, bookmarks: [...state.data.bookmarks, bookmark] },
      })),
      setSearchEngine: (searchEngine: SearchEngine) => set((state) => ({ data: { ...state.data, searchEngine } })),
      getRandomHeaderText: () => get().data.headerTexts[Math.floor(Math.random() * get().data.headerTexts.length)]
    }),
    { name: "startpage-store" },
  ),
);
