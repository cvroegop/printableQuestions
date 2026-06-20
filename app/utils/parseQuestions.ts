const WHATSAPP_LINE = /^\[\d{1,2}:\d{2}(?::\d{2})?,\s*\d{1,2}-\d{1,2}-\d{2,4}\]\s*[^:]+:\s*(.*)$/

export function parseQuestions(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = line.match(WHATSAPP_LINE)
      return match ? match[1].trim() : line
    })
    .filter((line) => line.length > 0)
}
