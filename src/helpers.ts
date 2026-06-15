import data from '../data/data.json'
import type { Bookmark, SearchEngine } from './types'

export function getRandomHeaderText(): string {
  const headerTexts: string[] = data.headerTexts
  return headerTexts[Math.floor(Math.random() * headerTexts.length)]
}

export function getBookmarks(): Bookmark[] {
  return data.bookmarks
}

export function getSearchEngine(): SearchEngine {
  return data.searchEngine
}
