import type { ReactNode } from "react"
import { usePageStore } from "../stores/page"
import type { Bookmark } from "../types"
import { getIconUrl } from "../utils"

export type Props = {
  bookmark: Bookmark
}

export default function Bookmark({ bookmark }: Props) {

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
  const keystrokes = usePageStore((state) => state.keystrokes)
  return (
    <div className="flex flex-row items-center gap-2">
      <img src={getIconUrl(bookmark)} className="h-4"/>
      <a key={bookmark.id} href={bookmark.url} className={'hover:underline ' + (bookmark.shortcut.join("").startsWith(keystrokes.join("")) ? "" : "opacity-30")}>{formatBookmarkTitle(bookmark)}</a>
    </div>
  )
}
