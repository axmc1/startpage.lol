export type Bookmark = {
  id: string
  name: string
  url: string
  iconUrl: string
  shortcut: string[]
}

export type SearchEngine = {
  name: string
  url: string
}

export type StartpageConfig = {
  headerTexts: string[]
  bookmarks: Bookmark[]
  searchEngine: SearchEngine
}
