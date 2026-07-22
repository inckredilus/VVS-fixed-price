// /src/utils/loadMarkdown.ts
// -----------------------------------------------------------------------------
// Markdown loading helpers
// -----------------------------------------------------------------------------
//
// These functions load Markdown files from the application's public folder.
//
// Important:
// - fetch() does not automatically throw an error for HTTP 404 or 500 responses.
// - Therefore, response.ok must be checked explicitly.
// - Some development servers may return index.html when a requested file is
//   missing. The HTML check below protects against treating that page as
//   Markdown content.
// -----------------------------------------------------------------------------

/**
 * Loads a Markdown file and returns its text content.
 *
 * Throws an error when:
 * - the HTTP request fails,
 * - the server returns a non-success status such as 404,
 * - or the returned content appears to be the application's index.html file.
 */
export async function loadMarkdown(filePath: string): Promise<string> {
  const response = await fetch(filePath);

  // fetch() resolves normally even for HTTP errors such as 404.
  // Check response.ok so callers can handle missing files correctly.
  if (!response.ok) {
    throw new Error(
      `Could not load Markdown file: ${filePath} (${response.status})`
    );
  }

  const text = await response.text();

  // Vite or another development server may return index.html instead of
  // returning a normal 404 response for a missing public file.
  //
  // trimStart() removes leading whitespace, and toLowerCase() makes the check
  // independent of whether the server uses <!DOCTYPE html> or <!doctype html>.
  if (text.trimStart().toLowerCase().startsWith("<!doctype html")) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }

  return text;
}

/**
 * Loads a Markdown file and uses another Markdown file as fallback.
 *
 * Example:
 * - First try a service-specific description.
 * - If it is missing, load the shared "description missing" Markdown file.
 *
 * If both files fail to load, the error from the fallback file is allowed to
 * propagate to the caller.
 */
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