// /src/components/services/ServiceSelection.tsx
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import ReactMarkdown from "react-markdown";
import type { NavigationLevel } from "../../types/services";

import "../../styles/buttons.css";
import "../../styles/components/services/service-selection.css";

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

type Props = {
  currentLevel: NavigationLevel;
  path: string[];
  onSelect: (label: string) => void;
  onBack: () => void;
  onHome: () => void;
  navigationDescription: string;
};

// ---------------------------------------------------------------------------
// Component: ServiceSelection
//
// Displays one navigation level in the service selection hierarchy.
//
// Responsibilities:
// - Display the current navigation path.
// - Display contextual Markdown information for the current level.
// - Present available service/category choices.
// - Allow navigation backwards in the hierarchy.
// - Allow return to the Home page.
//
// Styling is handled in:
//
//   src/styles/components/services/service-selection.css
// ---------------------------------------------------------------------------

export default function ServiceSelection({
  currentLevel,
  path,
  navigationDescription,
  onSelect,
  onBack,
  onHome,
}: Props) {
  return (
    <main className="service-selection">

      {/* ---------------------------------------------------------------
        Page header
       --------------------------------------------------------------- */}
      <section className="service-selection__header">
        <h1 className="service-selection__title">Välj VVS-tjänst</h1>

        {path.length > 0 && (
          <p className="service-selection__path">
            <strong>Val:</strong> {path.join(" > ")}
          </p>
        )}
      </section>
      
      {/* ---------------------------------------------------------------
        Current level description
       --------------------------------------------------------------- */}
      {navigationDescription && (
        <section className="service-selection__description markdown-content">
          <ReactMarkdown>{navigationDescription}</ReactMarkdown>
        </section>
      )}

      {/* ---------------------------------------------------------------
        Service/category options
       --------------------------------------------------------------- */}
      <section className="service-selection__options">
        {Object.keys(currentLevel).map((label) => (
          <button
            key={label}
            className="service-selection__option"
            onClick={() => onSelect(label)}
          >
            {label}
          </button>
        ))}
      </section>

      {/* ---------------------------------------------------------------
        Navigation actions
       --------------------------------------------------------------- */}
      <section className="service-selection__actions">
        {path.length > 0 && (
          <button
            className="button button--secondary"
            onClick={onBack}
          >
            Tillbaka
          </button>
        )}

        <button
          className="button button--ghost"
          onClick={onHome}
        >
          Startsida
        </button>
      </section>
    </main>
  );
}