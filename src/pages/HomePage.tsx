import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { loadMarkdown } from "../utils/loadMarkdown";

type Props = {
  onStartSelection: () => void;
};

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

    // Moved loadMarkdown() to utils/loadMarkdown.ts

  // ---------------------------------------------------------------------------
  // Effects: load Home page markdown content
  // ---------------------------------------------------------------------------

useEffect(() => {
  loadMarkdown("/descriptions/home/title.md")
    .then(setTitleText)
    .catch(() => setTitleText(""));

  loadMarkdown("/descriptions/home/intro.md")
    .then(setIntroText)
    .catch(() => setIntroText(""));

  loadMarkdown("/descriptions/home/services.md")
    .then(setServicesText)
    .catch(() => setServicesText(""));

  loadMarkdown("/descriptions/home/about.md")
    .then(setAboutText)
    .catch(() => setAboutText(""));
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