import { useEffect, useState } from "react";

type Pricing = {
  fullPrice: number;
  discountPrice: number;
};

type Service = {
  serviceId: number;
  category: string;
  serviceName: string;
  equipment: string;
  work: string;
  pricing: Pricing;
};

type NavigationLeaf = string;

type NavigationLevel = {
  [key: string]: NavigationLevel | NavigationLeaf;
};

type ServicesJson = {
  navigation: NavigationLevel;
  services: Record<string, Service>;
};

export default function ServiceBrowser() {
  const [data, setData] = useState<ServicesJson | null>(null);
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [descriptionText, setDescriptionText] = useState<string>("");

  const imageSrc = selectedService
    ? `/images/services/${selectedService.serviceId}.jpeg`
    : "";

  useEffect(() => {
    fetch("/data/services.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load services.json");
        }
        return response.json();
      })
      .then((json: ServicesJson) => {
        setData(json);
        setCurrentLevel(json.navigation);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (!selectedService) return;

    const serviceId = selectedService.serviceId;
   
    fetch(`/descriptions/services/${serviceId}.md`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Description file not found");
        }
        return response.text();
      })
      .then((text) => {
        setDescriptionText(text);
      })
      .catch(() => {
        setDescriptionText("Detaljerad beskrivning saknas för denna tjänst.");
      });
  }, [selectedService]);

  function handleSelection(label: string) {
    if (!currentLevel || !data) return;

    const nextValue = currentLevel[label];

    if (typeof nextValue === "string") {
      const service = data.services[nextValue];
      setSelectedService(service);
      setPath([...path, label]);
      return;
    }

    setCurrentLevel(nextValue);
    setPath([...path, label]);
  }

  function resetBrowser() {
    if (!data) return;

    setCurrentLevel(data.navigation);
    setPath([]);
    setSelectedService(null);
  }

  function goBack() {
    if (!data || path.length === 0) return;

    const newPath = path.slice(0, -1);

    let level: NavigationLevel = data.navigation;

    for (const item of newPath) {
    const next = level[item];

    if (typeof next === "string") {
        throw new Error(
        `Unexpected service ID encountered while rebuilding navigation path: ${next}`
        );
    }

  level = next;
}
    setCurrentLevel(level);
    setPath(newPath);
    setSelectedService(null);
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (!data || !currentLevel) {
    return <p>Laddar tjänster...</p>;
  }

  if (selectedService) {
    return (
      <main>
        <h1>{selectedService.work}</h1>

        <p>
          {selectedService.category} &gt; {selectedService.serviceName} &gt;{" "}
          {selectedService.work}
        </p>

        <img
          src={imageSrc}
          alt={`Bild för ${selectedService.serviceName} - ${selectedService.work}`}
          onError={(event) => {
            event.currentTarget.src = "/images/image_missing.jpeg";
          }}
          style={{
            width: "100%",
            maxWidth: "480px",
            height: "auto",
            display: "block",
            marginBottom: "1rem",
          }}
        />

        <div>
          <p>
            <strong>Ordinarie pris:</strong>{" "}
            {formatPrice(selectedService.pricing.fullPrice)}
          </p>
          <p>
            <strong>ROT-pris:</strong>{" "}
            {formatPrice(selectedService.pricing.discountPrice)}
          </p>
        </div>

        <section>
          <h2>Beskrivning</h2>
          <div style={{ whiteSpace: "pre-wrap" }}>{descriptionText}</div>
        </section>

        <p>
          <strong>ServiceID:</strong> {selectedService.serviceId}
        </p>

        <button onClick={resetBrowser}>OK</button>
      </main>
    );
  }

  return (
    <main>
      <h1>Välj VVS-tjänst</h1>

      {path.length > 0 && (
        <p>
          <strong>Val:</strong> {path.join(" / ")}
        </p>
      )}

      <div>
        {Object.keys(currentLevel).map((label) => (
          <button
            key={label}
            onClick={() => handleSelection(label)}
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

      {path.length > 0 && <button onClick={goBack}>Tillbaka</button>}
    </main>
  );
}