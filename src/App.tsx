import { useEffect, useRef, useState, type ReactNode } from "react";
import { getRandomText } from "./data/headerTexts";

interface Bookmark {
  name: string
  url: string
  icon: string
  shortcut: string[]
}

const headerText = getRandomText()

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const placeholderBase = "press / to search"
  const [placeholderText, setPlaceholderText] = useState(placeholderBase)
  const [keystrokes, setKeystrokes] = useState([] as string[])
  const bookmarks: Bookmark[] = [
    { name: "hackernews", url: "https://news.ycombinator.com/", icon: "", shortcut: ["h", "n"] },
    { name: "gitea", url: "https://git.lunanet.lol", icon: "", shortcut: ["g", "t"] },
    { name: "youtube", url: "https://youtube.com", icon: "", shortcut: ["y", "t"] },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) return
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
        const match = bookmarks.find(b => b.shortcut.join("") === nextKeystrokes.join(""))
        if (match) {
          setKeystrokes([])
          setPlaceholderText(`Redirecting to ${match.name}...`)
          window.location.href = match.url
          return
        }
        const sequenceMatch = bookmarks.find(b => b.shortcut[nextKeystrokes.length - 1] === e.key)
        if (sequenceMatch === undefined) {
          setKeystrokes([])
          if (nextKeystrokes.length != 1) {
            setPlaceholderText(`FailFast: No more matching shortcuts [${nextKeystrokes.join(",")}]`)
            setTimeout(() => {
              setPlaceholderText(placeholderBase)
            }, 1000)
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
    <div className="bg-[#0a0a0a] flex h-screen w-full">
      <div className="flex flex-col px-96 py-64 w-full">
        <h1 className="text-white text-5xl italic">{headerText}</h1>
        <input ref={inputRef} type="text" className="text-white w-full h-12 outline-0 font-mono" placeholder={placeholderText} />
        <div className="flex flex-row gap-8">
          {
            bookmarks.map((bookmark, index) => (
              <a key={index} href={bookmark.url} className={'hover:underline ' + (bookmark.shortcut.join("").startsWith(keystrokes.join("")) ? "" : "opacity-30")}>{formatBookmarkTitle(bookmark)}</a>
            ))
          }
        </div>
      </div>
    </div>
  );
}
