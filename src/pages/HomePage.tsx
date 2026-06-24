import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { loadMarkdown } from "../utils/loadMarkdown";
import "../styles/pages/home.css";

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
    <main className="home">
      <section className="home__title markdown-content">
        <ReactMarkdown>{titleText}</ReactMarkdown>
      </section>

      <section className="home__intro markdown-content">
        <ReactMarkdown>{introText}</ReactMarkdown>
      </section>

      <section className="home__services markdown-content">
        <ReactMarkdown>{servicesText}</ReactMarkdown>
      </section>

      <section className="home__about markdown-content">
        <ReactMarkdown>{aboutText}</ReactMarkdown>
      </section>

      <button className="home__button" onClick={onStartSelection}>
        Välj tjänst
      </button>
    </main>
  );
}