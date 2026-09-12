import { useCallback, useEffect, useRef, useState } from "react";
import { useDataStore } from "./stores/data";
import { usePageStore } from "./stores/page";
import Bookmark from "./components/Bookmark";
import { useShallow } from "zustand/shallow";
import { useLocation } from "wouter";

export default function Startpage() {
  const data = useDataStore((state) => state.data)
  const [headerText] = useState(() => useDataStore.getState().getRandomHeaderText())
  const inputRef = useRef<HTMLInputElement>(null)
  const placeholderText = usePageStore((state) => state.placeholderText)
  const [setPlaceholderText, clearPlaceholderText, appendKeystroke, clearKeystrokes] = usePageStore(useShallow((state) => [state.setPlaceholderText, state.clearPlaceholderText, state.appendKeystroke, state.clearKeystrokes]))
  const [, setLocation] = useLocation()

  const search = useCallback(() => {
    const query = inputRef.current?.value
    if (!query) return
    if (query === "/edit") {
      setLocation(query)
      return
    }
    setPlaceholderText(`Searching with ${data.searchEngine.name}..`)
    window.location.href = data.searchEngine.url.replace("%s", encodeURIComponent(query))
  }, [data.searchEngine.name, data.searchEngine.url, setPlaceholderText, setLocation])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const focusedSearch = document.activeElement === inputRef.current
      if (e.key === "Escape") {
        clearKeystrokes()
        clearPlaceholderText()
        inputRef.current?.blur();
        return
      }
      if (e.key === "/" && !focusedSearch) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Enter" && focusedSearch) {
        search()
        return
      }
      if (e.key.length === 1 && !focusedSearch) {
        appendKeystroke(e.key)
        const nextKeystrokes = usePageStore.getState().keystrokes
        const exactMatch = data.bookmarks.find(b => b.shortcut.join("") === nextKeystrokes.join(""))
        if (exactMatch) {
          clearKeystrokes()
          setPlaceholderText(`Redirecting to ${exactMatch.name}...`)
          window.location.href = exactMatch.url
          setTimeout(() => {
            clearPlaceholderText()
          }, 1500)
          return
        }
        const currentSequenceMatch = data.bookmarks.find(b => b.shortcut[nextKeystrokes.length - 1] === e.key)
        if (currentSequenceMatch === undefined) {
          clearKeystrokes()
          if (nextKeystrokes.length != 1) {
            setPlaceholderText(`FailFast: No more matching shortcuts [${nextKeystrokes.join(",")}]`)
            setTimeout(() => {
              clearPlaceholderText()
            }, 1500)
          }
          return
        }
        setPlaceholderText(`[${nextKeystrokes.join(",")}]`)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [appendKeystroke, clearKeystrokes, clearPlaceholderText, data.bookmarks, search, setPlaceholderText])

  return (
    <div className="bg-[#0a0a0a] flex h-screen w-full flex-col px-8 py-12 md:px-16 md:py-24 lg:p-48 xl:px-96 xl:py-64">
        <h1 className="text-white text-3xl md:text-5xl italic">{headerText}</h1>
        <input ref={inputRef} type="text" className="text-white w-full h-12 outline-0 font-mono" placeholder={placeholderText}/>
        <div className="flex flex-wrap gap-4">
          {
            data.bookmarks.map((bookmark) => (
              <Bookmark key={bookmark.id} bookmark={bookmark}/>
            ))
          }
        </div>
      </div>
  );
}
