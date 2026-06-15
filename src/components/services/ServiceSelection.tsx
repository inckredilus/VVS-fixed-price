import type { NavigationLevel } from "../../types/services";

type Props = {
  currentLevel: NavigationLevel;
  path: string[];
  onSelect: (label: string) => void;
  onBack: () => void;
  onHome: () => void;
};

export default function ServiceSelection({
  currentLevel,
  path,
  onSelect,
  onBack,
  onHome,
}: Props) {
  return (
    <main>
      <h1>Välj VVS-tjänst (v1.1)</h1>

      {path.length > 0 && (
        <p>
          <strong>Val:</strong> {path.join(" / ")}
        </p>
      )}

      <div>
        {Object.keys(currentLevel).map((label) => (
          <button
            key={label}
            onClick={() => onSelect(label)}
            style={{
              display: "block",
              marginBottom: "0.75rem",
              padding: "0.75rem 1rem",
              width: "100%",
              maxWidth: "420px",
              textAlign: "left",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {path.length > 0 && <button onClick={onBack}>Tillbaka</button>}

      <button onClick={onHome}>Startsida</button>

    </main>
  );
}