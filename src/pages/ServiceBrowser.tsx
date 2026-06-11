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

  const [quantity, setQuantity] = useState<number>(0);
  const [showOrderPage, setShowOrderPage] = useState<boolean>(false);

// State and Effects

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
      .then((response) => response.text())
      .then((text) => {
        if (text.trim().startsWith("<!doctype html>")) {
          throw new Error("Description file not found");
        }

        setDescriptionText(text);
      })
      .catch(() => {
        fetch("/descriptions/description_missing.md")
          .then((response) => response.text())
          .then((text) => {
            setDescriptionText(text);
          })
          .catch(() => {
            setDescriptionText("Detaljerad beskrivning saknas för denna tjänst.");
          });
      });
  }, [selectedService]);

// Functions

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

    setQuantity(0);
    setShowOrderPage(false);

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

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(0, current - 1));
  }

  function addToOrder() {
    if (quantity > 0) {
      setShowOrderPage(true);
    }
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

  if (showOrderPage && selectedService) {
    return (
      <main>
        <h1>Din beställning</h1>

        <p>
          <strong>Tjänst:</strong> {selectedService.serviceName}
        </p>

        <p>
          <strong>Arbete:</strong> {selectedService.work}
        </p>

        <p>
          <strong>Antal:</strong> {quantity}
        </p>

        <p>
          <strong>Ordinarie pris:</strong>{" "}
          {formatPrice(selectedService.pricing.fullPrice * quantity)}
        </p>

        <p>
          <strong>ROT-pris:</strong>{" "}
          {formatPrice(selectedService.pricing.discountPrice * quantity)}
        </p>

        <p>
          <strong>ServiceID:</strong> {selectedService.serviceId}
        </p>

        <button onClick={resetBrowser}>OK</button>
      </main>
    );
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

        <section>
          <h2>Antal</h2>

          <button onClick={decreaseQuantity} disabled={quantity === 0}>
            -
          </button>

          <span style={{ margin: "0 1rem" }}>{quantity}</span>

          <button onClick={increaseQuantity}>+</button>
        </section>

        <div style={{ marginTop: "1rem" }}>
          <button onClick={goBack}>Tillbaka</button>

          <button onClick={addToOrder} disabled={quantity === 0}>
            Lägg till
          </button>

          <button onClick={resetBrowser}>Avbryt</button>
        </div>

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