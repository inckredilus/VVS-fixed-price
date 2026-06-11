import { useEffect, useState } from "react";

import ServiceDetail from "../components/services/ServiceDetail";
import ServiceOrder from "../components/services/ServiceOrder";
import ServiceSelection from "../components/services/ServiceSelection";

import type {
  NavigationLevel,
  Service,
  ServicesJson,
} from "../types/services";

export default function ServiceBrowser() {
  // ---------------------------------------------------------------------------
  // State definitions
  // ---------------------------------------------------------------------------

  const [data, setData] = useState<ServicesJson | null>(null);
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [descriptionText, setDescriptionText] = useState<string>("");

  const [quantity, setQuantity] = useState<number>(0);
  const [showOrderPage, setShowOrderPage] = useState<boolean>(false);

  const imageSrc = selectedService
    ? `/images/services/${selectedService.serviceId}.jpeg`
    : "";

  // ---------------------------------------------------------------------------
  // Effects: load JSON and service descriptions
  // ---------------------------------------------------------------------------

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
            setDescriptionText(
              "Detaljerad beskrivning saknas för denna tjänst."
            );
          });
      });
  }, [selectedService]);

  // ---------------------------------------------------------------------------
  // Functions: service selection and navigation
  // ---------------------------------------------------------------------------

  function handleSelection(label: string) {
    if (!currentLevel || !data) return;

    const nextValue = currentLevel[label];

    if (typeof nextValue === "string") {
      const service = data.services[nextValue];

      setSelectedService(service);
      setPath([...path, label]);
      setQuantity(0);
      return;
    }

    setCurrentLevel(nextValue);
    setPath([...path, label]);
  }

  function resetBrowser() {
    if (!data) return;

    setQuantity(0);
    setShowOrderPage(false);
    setDescriptionText("");

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
    setQuantity(0);
    setShowOrderPage(false);
  }

  // ---------------------------------------------------------------------------
  // Functions: quantity and temporary order flow
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Helper functions
  // ---------------------------------------------------------------------------

  function formatPrice(value: number) {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(value);
  }

  // ---------------------------------------------------------------------------
  // Page rendering
  // ---------------------------------------------------------------------------

  if (!data || !currentLevel) {
    return <p>Laddar tjänster...</p>;
  }

  if (showOrderPage && selectedService) {
    return (
      <ServiceOrder
        service={selectedService}
        quantity={quantity}
        onOk={resetBrowser}
        formatPrice={formatPrice}
      />
    );
  }

  if (selectedService) {
    return (
      <ServiceDetail
        service={selectedService}
        descriptionText={descriptionText}
        imageSrc={imageSrc}
        quantity={quantity}
        onBack={goBack}
        onCancel={resetBrowser}
        onAddToOrder={addToOrder}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        formatPrice={formatPrice}
      />
    );
  }

  return (
    <ServiceSelection
      currentLevel={currentLevel}
      path={path}
      onSelect={handleSelection}
      onBack={goBack}
    />
  );
}