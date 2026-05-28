import { useEffect, useRef, type ReactNode } from "react";

interface Bookmark {
  name: string
  url: string
  icon: string
  shortcut: string[]
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const bookmarks: Bookmark[] = [
    { name: "hackernews", url: "https://news.ycombinator.com/", icon: "", shortcut: ["h", "n"] },
    { name: "gitea", url: "https://git.lunanet.lol", icon: "", shortcut: ["g", "t"] },
    { name: "youtube", url: "https://youtube.com", icon: "", shortcut: ["y", "t"] },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

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
        <h1 className="text-white text-5xl italic">heyo</h1>
        <input ref={inputRef} type="text" className="text-white w-full h-12 outline-0 font-mono" placeholder="press / to search" />
        <div className="flex flex-row gap-8">
          {
            bookmarks.map((bookmark, index) => (
              <a key={index} href={bookmark.url} className="hover:underline">{formatBookmarkTitle(bookmark)}</a>
            ))
          }
        </div>
      </div>
    </div>
  );
}
