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
        <div className="home__hero-content">

          <ReactMarkdown>{titleText}</ReactMarkdown>
                    
          <button
            className="home__hero-button"
            onClick={onStartSelection}
          >Till våra tjänster
          </button>

        </div>
      </section>

{/* ---------------------------------------------------------------------------
    Home information cards
    --------------------------------------------------------------------------- */}

      <div className="home__cards">
        <section className="home__card home__card--intro markdown-content">
          <ReactMarkdown>{introText}</ReactMarkdown>
        </section>

        <section className="home__card home__card--services markdown-content">
          <ReactMarkdown>{servicesText}</ReactMarkdown>
        </section>

        <section className="home__card home__card--about markdown-content">
          <ReactMarkdown>{aboutText}</ReactMarkdown>
        </section>
      </div>
    </main>
  );
}