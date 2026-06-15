import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  onStartSelection: () => void;
};

type MarkdownSetter = React.Dispatch<React.SetStateAction<string>>;

export default function HomePage({ onStartSelection }: Props) {
  // ---------------------------------------------------------------------------
  // State definitions
  // ---------------------------------------------------------------------------

  const [titleText, setTitleText] = useState<string>("");
  const [introText, setIntroText] = useState<string>("");
  const [servicesText, setServicesText] = useState<string>("");
  const [aboutText, setAboutText] = useState<string>("");

  // ---------------------------------------------------------------------------
  // Helper functions
  // ---------------------------------------------------------------------------

  function loadMarkdown(
    filePath: string,
    setter: MarkdownSetter
  ) {
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => {
        // Vite may return index.html instead of 404
        if (text.trim().startsWith("<!doctype html>")) {
          throw new Error(`Markdown file not found: ${filePath}`);
        }

        setter(text);
      })
      .catch(() => {
        setter("");
      });
  }

  // ---------------------------------------------------------------------------
  // Effects: load Home page markdown content
  // ---------------------------------------------------------------------------

  useEffect(() => {
    loadMarkdown(
      "/descriptions/home/title.md",
      setTitleText
    );

    loadMarkdown(
      "/descriptions/home/intro.md",
      setIntroText
    );

    loadMarkdown(
      "/descriptions/home/services.md",
      setServicesText
    );

    loadMarkdown(
      "/descriptions/home/about.md",
      setAboutText
    );
  }, []);

  // ---------------------------------------------------------------------------
  // Page rendering
  // ---------------------------------------------------------------------------

  return (
    <main>
      <section>
        <ReactMarkdown>
          {titleText}
        </ReactMarkdown>
      </section>

      <section>
        <ReactMarkdown>
          {introText}
        </ReactMarkdown>
      </section>

      <section>
        <ReactMarkdown>
          {servicesText}
        </ReactMarkdown>
      </section>

      <section>
        <ReactMarkdown>
          {aboutText}
        </ReactMarkdown>
      </section>

      <button onClick={onStartSelection}>
        Välj tjänst
      </button>
    </main>
  );
}