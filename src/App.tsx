import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Bookmark } from "./types";
import { useStore } from "./store";

export default function App() {
  const data = useStore((state) => state.data)
  const [headerText] = useState(() => useStore.getState().getRandomHeaderText())
  const inputRef = useRef<HTMLInputElement>(null)
  const placeholderBase = "press / to search"
  const [placeholderText, setPlaceholderText] = useState(placeholderBase)
  const [keystrokes, setKeystrokes] = useState([] as string[])

  function Search() {
    const query = inputRef.current?.value
    if (!query) return
    setPlaceholderText(`Searching with ${data.searchEngine.name}..`)
    window.location.href = data.searchEngine.url.replace("%s", encodeURIComponent(query))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const focusedSearch = document.activeElement === inputRef.current
      if (focusedSearch && e.key === "Enter") {
        Search()
        return
      }
      if (e.key === "Escape") {
        setKeystrokes([])
        setPlaceholderText(placeholderBase)
        return
      }
      if (e.key === "/") {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key.length === 1) {
        const nextKeystrokes = [...keystrokes, e.key]
        const match = data.bookmarks.find(b => b.shortcut.join("") === nextKeystrokes.join(""))
        if (match) {
          setKeystrokes([])
          setPlaceholderText(`Redirecting to ${match.name}...`)
          window.location.href = match.url
          return
        }
        const sequenceMatch = data.bookmarks.find(b => b.shortcut[nextKeystrokes.length - 1] === e.key)
        if (sequenceMatch === undefined) {
          setKeystrokes([])
          if (nextKeystrokes.length != 1) {
            setPlaceholderText(`FailFast: No more matching shortcuts [${nextKeystrokes.join(",")}]`)
            setTimeout(() => {
              setPlaceholderText(placeholderBase)
            }, 1500)
          }
          return
        }
        setKeystrokes(nextKeystrokes)
        setPlaceholderText(`[${nextKeystrokes.join(",")}]`)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  function formatBookmarkTitle(bookmark: Bookmark): ReactNode {
    let shortcutIndex = 0

    return (
      <>
        {bookmark.name.split("").map((char, index) => {
          if (char === bookmark.shortcut[shortcutIndex]) {
            shortcutIndex++
            return <b key={index}>{char}</b>
          }

          return <span key={index}>{char}</span>
        })}
      </>
    )
  }

  return (
    <div className="bg-[#0a0a0a] flex h-screen w-full flex-col px-8 py-12 md:px-16 md:py-24 lg:p-48 xl:px-96 xl:py-64">
        <h1 className="text-white text-3xl md:text-5xl italic">{headerText}</h1>
        <input ref={inputRef} type="text" className="text-white w-full h-12 outline-0 font-mono" placeholder={placeholderText}/>
        <div className="flex flex-wrap gap-4">
          {
            data.bookmarks.map((bookmark, index) => (
              <div className="flex flex-row items-center gap-2">
                <img src={bookmark.icon} className="h-4"/>
                <a key={index} href={bookmark.url} className={'hover:underline ' + (bookmark.shortcut.join("").startsWith(keystrokes.join("")) ? "" : "opacity-30")}>{formatBookmarkTitle(bookmark)}</a>
              </div>
            ))
          }
        </div>
      </div>
  );
}
