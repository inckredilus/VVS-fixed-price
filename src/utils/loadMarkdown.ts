export async function loadMarkdown(filePath: string): Promise<string> {
  const response = await fetch(filePath);
  const text = await response.text();

  // Vite may return index.html instead of a 404 for missing files.
  if (text.trim().startsWith("<!doctype html>")) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }

  return text;
}

export async function loadMarkdownOrFallback(
  filePath: string,
  fallbackPath: string
): Promise<string> {
  try {
    return await loadMarkdown(filePath);
  } catch {
    return await loadMarkdown(fallbackPath);
  }
}