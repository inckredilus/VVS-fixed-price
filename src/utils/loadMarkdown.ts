export async function loadMarkdown(filePath: string): Promise<string> {
  const response = await fetch(filePath);
  const text = await response.text();

  if (text.trim().startsWith("<!doctype html>")) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }

  return text;
}