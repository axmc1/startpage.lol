import type { Bookmark } from "./types"

export function getIconUrl(bookmark: Bookmark) {
  if (bookmark.iconUrl === "")
    return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(bookmark.url)}&sz=64`
  return bookmark.iconUrl
}
