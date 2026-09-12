import { useShallow } from "zustand/shallow";
import { useDataStore } from "./stores/data";
import { getIconUrl } from "./utils";
import type { Bookmark } from "./types";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation } from "wouter";

export default function Edit() {
  const data = useDataStore((state) => state.data);
  const [
    addHeaderText,
    addBookmark,
    setSearchEngine,
    deleteHeaderText,
    deleteBookmark,
  ] = useDataStore(
    useShallow((state) => [
      state.addHeaderText,
      state.addBookmark,
      state.setSearchEngine,
      state.deleteHeaderText,
      state.deleteBookmark,
    ]),
  );
  const [, setLocation] = useLocation()

  const redirectToHome = useCallback(() => {
    setLocation('/')
  }, [setLocation])

  useHotkeys('tab>enter', redirectToHome, { enableOnFormTags: true })

  const onHeaderSubmit = useCallback((e: React.SubmitEvent) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const headerText = formData.get("headerText")!.toString();
    addHeaderText(headerText);
    form.reset()
  }, [addHeaderText])

  const onBookmarkSubmit = useCallback((e: React.SubmitEvent) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      name: formData.get("name")!.toString(),
      url: formData.get("url")!.toString(),
      iconUrl: formData.get("iconUrl")?.toString().trim() || "",
      shortcut: formData.get("shortcut")?.toString().split("") ?? [],
    };
    addBookmark(bookmark)
    form.reset()
  }, [addBookmark])

  const onSearchEngineChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (e.target.checkValidity()) {
      setSearchEngine({ name: data.searchEngine.name, url });
    } else {
      e.target.reportValidity();
    }
  }, [data.searchEngine.name, setSearchEngine]);

  return (
    <div className="flex h-screen w-full justify-center px-8 py-12 md:px-16 md:py-24 lg:p-48 xl:px-96 xl:py-48">
      <div className="flex items-center w-lg flex-col">
        <h1>Settings</h1>
        <h2>Header Texts</h2>
        <div className="w-full">
          {data.headerTexts.map((headerText, index) => (
            <div key={index} className="flex justify-between border px-4 py-2">
              <p>{headerText}</p>
              <button onClick={() => deleteHeaderText(index)}>del</button>
            </div>
          ))}
          <form onSubmit={onHeaderSubmit}>
            <input
              name="headerText"
              type="text"
              placeholder="new header text"
              className="text-white border w-full px-4 py-2"
              required
            />
          </form>
        </div>
        <h2>Bookmarks</h2>
        <div>
          <div className="flex flex-col">
            {data.bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="w-lg border border-white px-4 py-2 flex items-center flex-col">
                <div className="w-full flex justify-between">
                  <img src={getIconUrl(bookmark)} className="h-8" />
                  <p>{bookmark.name}</p>
                  <button onClick={() => deleteBookmark(bookmark.id)}>
                    del
                  </button>
                </div>
                <div className="w-full flex justify-evenly">
                  <p>{bookmark.url}</p>
                  <p>{bookmark.shortcut?.join("")}</p>
                </div>
              </div>
            ))}
            <form onSubmit={onBookmarkSubmit}>
              <input
                name="name"
                type="text"
                placeholder="name*"
                className="text-white border w-full px-4 py-2"
                required
              />
              <input
                name="url"
                type="url"
                placeholder="url*"
                className="text-white border w-full px-4 py-2"
                required
              />
              <input
                name="shortcut"
                type="text"
                placeholder="keystroke shortcut, joined together (i.e. 'gh')"
                className="text-white border w-full px-4 py-2"
              />
              <input
                name="iconUrl"
                type="url"
                placeholder="icon url (leave empty for favicon)"
                className="text-white border w-full px-4 py-2"
              />
              <button type="submit" className="hidden" />
            </form>
          </div>
        </div>
        <h2>Search Engine</h2>
        <div className="w-full">
          <input
            type="url"
            placeholder="search engine URI (%s = query)"
            className="text-white border w-full px-4 py-2"
            defaultValue={data.searchEngine.url}
            required
            title="URL must contain %s for search query"
            pattern="https?:\/\/.*%s"
            onChange={onSearchEngineChange}
          />
        </div>
        <p className="text-xs py-2 text-white/50">tab + enter to go back</p>
      </div>
    </div>
  );
}
