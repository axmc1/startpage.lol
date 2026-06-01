const headerTexts: string[] = [
  "heyo",
  "mes amis!",
  "don't push on fridays",
  "if yer aunt had balls, she'd be your uncle, but she doesn't, so she's not"
]

export function getRandomText(): string {
  return headerTexts[Math.floor(Math.random() * headerTexts.length)]
}
