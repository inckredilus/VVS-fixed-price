import { useEffect, useState } from "react";

import HomePage from "./HomePage";

import ServiceDetail from "../components/services/ServiceDetail";
import ServiceOrder from "../components/services/ServiceOrder";
import ServiceSelection from "../components/services/ServiceSelection";

import type {
  CartItem,
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

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [showHomePage, setShowHomePage] = useState<boolean>(true);

  const imageSrc = selectedService
    ? `/images/services/${selectedService.serviceId}.jpeg`
    : "";

  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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

  function startSelection() {
    setShowHomePage(false);
  }
  
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
    setCartItems([]);

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

  function goToHomePage() {
    setShowHomePage(true);
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

  function clearQuantity() {
    setQuantity(0);
  }

  function addToOrder() {
    if (!selectedService || quantity === 0) return;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.service.serviceId === selectedService.serviceId
      );

      if (!existingItem) {
        return [
          ...currentItems,
          {
            service: selectedService,
            quantity,
          },
        ];
      }

      return currentItems.map((item) =>
        item.service.serviceId === selectedService.serviceId
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    });

    setQuantity(0);
  }

  function goToOrderPage() {
    if (cartItems.length > 0) {
      setShowOrderPage(true);
    }
  }

  function cancelOrder() {
    const hasCartItems = cartItems.length > 0;

    if (hasCartItems) {
      const confirmed = window.confirm(
        "Vill du avbryta och tömma hela beställningen?"
      );

      if (!confirmed) return;
    }

    resetBrowser();
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

  if (showHomePage) {
    return <HomePage onStartSelection={startSelection} />;
  }

  if (!data || !currentLevel) {
    return <p>Laddar tjänster...</p>;
  }

  if (showOrderPage && selectedService) {
    return (
      <ServiceOrder
        cartItems={cartItems}
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
        cartItemCount={cartItemCount}
        onBack={goBack}
        onCancel={cancelOrder}
        onClearQuantity={clearQuantity}
        onAddToOrder={addToOrder}
        onGoToOrderPage={goToOrderPage}
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
      onHome={goToHomePage}
    />
  );
}