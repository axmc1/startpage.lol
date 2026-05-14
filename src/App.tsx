import { useEffect, useRef, useState } from "react";

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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

  return (
    <div className="bg-[#0a0a0a] flex h-screen w-full">
      <div className="flex flex-col px-96 py-64 w-full">
        <h1 className="text-white text-5xl font-bold">{time}</h1>
        <input ref={inputRef} type="text" className="text-white w-full h-12 outline-0" placeholder="press / to search" />
      </div>
    </div>
  );
}
