import { useEffect, useState } from "react";

import HomePage from "./HomePage";
import ServiceDetail from "../components/services/ServiceDetail";
import ServiceOrder from "../components/services/ServiceOrder";
import ServiceSelection from "../components/services/ServiceSelection";
import CustomerDetailsForm from "../components/services/CustomerDetailsForm";
import OrderConfirmation from "../components/services/OrderConfirmation";

import {
  loadMarkdown,
  loadMarkdownOrFallback,
} from "../utils/loadMarkdown";

import type {
  CartItem,
  CustomerDetails,
  NavigationLevel,
  Service,
  ServicesJson,
} from "../types/services";

export default function ServiceBrowser() {
  // ---------------------------------------------------------------------------
  // State: loaded service data and current navigation position
  // ---------------------------------------------------------------------------

  const [data, setData] = useState<ServicesJson | null>(null);
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // ---------------------------------------------------------------------------
  // State: markdown content for selected service and navigation level
  // ---------------------------------------------------------------------------

  const [descriptionText, setDescriptionText] = useState<string>("");
  const [navigationDescription, setNavigationDescription] =
    useState<string>("");

  // ---------------------------------------------------------------------------
  // State: current service quantity and ROT choice before adding to cart
  // ---------------------------------------------------------------------------

  const [quantity, setQuantity] = useState<number>(0);
  const [useRotDeduction, setUseRotDeduction] = useState<boolean>(true);

  // ---------------------------------------------------------------------------
  // State: page visibility flags
  // ---------------------------------------------------------------------------

  const [showHomePage, setShowHomePage] = useState<boolean>(true);
  const [showOrderPage, setShowOrderPage] = useState<boolean>(false);
  const [showCustomerDetailsPage, setShowCustomerDetailsPage] =
    useState<boolean>(false);
  const [showConfirmationPage, setShowConfirmationPage] =
    useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // State: customer details and cart
  // ---------------------------------------------------------------------------

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    comment: "",
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ---------------------------------------------------------------------------
  // Derived values: calculated from state, not stored separately
  // ---------------------------------------------------------------------------

  const imageSrc = selectedService
    ? `/images/services/${selectedService.serviceId}.jpg`
    : "";

  const navigationMarkdownPath =
    data && path.length > 0
      ? data.navigationDescriptions[path.join("|")] ?? ""
      : "";

  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ---------------------------------------------------------------------------
  // Effect: load generated service JSON from public/data/services.json
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

  // ---------------------------------------------------------------------------
  // Effect: load markdown description for the selected final service
  // ---------------------------------------------------------------------------
  // The service description uses ServiceID as filename:
  // /descriptions/services/<ServiceID>.md
  //
  // If the service-specific file is missing, the shared fallback file is used:
  // /descriptions/description_missing.md
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!selectedService) return;

    const serviceId = selectedService.serviceId;

    loadMarkdownOrFallback(
      `/descriptions/services/${serviceId}.md`,
      "/descriptions/description_missing.md"
    )
      .then(setDescriptionText)
      .catch(() => {
        setDescriptionText(
          "Detaljerad beskrivning saknas för denna tjänst."
        );
      });
  }, [selectedService]);

  // ---------------------------------------------------------------------------
  // Effect: load optional markdown description for the current navigation level
  // ---------------------------------------------------------------------------
  // Navigation descriptions are optional. If the file does not exist, the
  // selection page simply shows no extra description for that level.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!navigationMarkdownPath) return;

    loadMarkdown(navigationMarkdownPath)
      .then(setNavigationDescription)
      .catch(() => {
        setNavigationDescription("");
      });
  }, [navigationMarkdownPath]);

  // ---------------------------------------------------------------------------
  // Navigation: enter the service-selection flow from the Home page
  // ---------------------------------------------------------------------------

  function startSelection() {
    setShowHomePage(false);
  }

  // ---------------------------------------------------------------------------
  // Navigation: handle drill-down through the generated service hierarchy
  // ---------------------------------------------------------------------------
  // If the clicked value is a string, it is a ServiceID and we have reached the
  // final service. Otherwise, it is another navigation level.
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

  // ---------------------------------------------------------------------------
  // Navigation: reset entire browser flow back to the start state
  // ---------------------------------------------------------------------------
  // This clears the cart, quantity, selected service, customer details page,
  // confirmation page, and returns to the top of the generated navigation tree.
  // ---------------------------------------------------------------------------

  function resetBrowser() {
    if (!data) return;

    setQuantity(0);
    setShowOrderPage(false);
    setDescriptionText("");
    setCartItems([]);

    setCurrentLevel(data.navigation);
    setPath([]);
    setSelectedService(null);

    setShowCustomerDetailsPage(false);
    setShowConfirmationPage(false);
  }

  // ---------------------------------------------------------------------------
  // Navigation: go back one level in the service-selection hierarchy
  // ---------------------------------------------------------------------------
  // The current tree level is rebuilt from the saved path rather than stored
  // independently for every previous step.
  // ---------------------------------------------------------------------------

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
  // Navigation: return from service selection to the Home page
  // ---------------------------------------------------------------------------

  function goToHomePage() {
    setShowHomePage(true);
  }

  // ---------------------------------------------------------------------------
  // Quantity controls for the currently selected service
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

  // ---------------------------------------------------------------------------
  // Cart: add currently selected service to the cart
  // ---------------------------------------------------------------------------
  // If the same service is added again with the same ROT selection, quantities
  // are combined into one cart row. If ROT differs, it becomes a separate row.
  // ---------------------------------------------------------------------------

  function addToOrder() {
    if (!selectedService || quantity === 0) return;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.service.serviceId === selectedService.serviceId &&
          item.useRotDeduction === useRotDeduction
      );

      if (!existingItem) {
        return [
          ...currentItems,
          {
            service: selectedService,
            quantity,
            useRotDeduction,
          },
        ];
      }

      return currentItems.map((item) =>
        item.service.serviceId === selectedService.serviceId &&
        item.useRotDeduction === useRotDeduction
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    });

    setQuantity(0);
  }

  // ---------------------------------------------------------------------------
  // Page flow: order/cart page
  // ---------------------------------------------------------------------------

  function goToOrderPage() {
    if (cartItems.length > 0) {
      setShowOrderPage(true);
    }
  }

  function goBackFromOrder() {
    setShowOrderPage(false);
  }

  // ---------------------------------------------------------------------------
  // Page flow: customer details page
  // ---------------------------------------------------------------------------

  function goToCustomerDetails() {
    setShowOrderPage(false);
    setShowCustomerDetailsPage(true);
  }

  function goBackToOrderPage() {
    setShowCustomerDetailsPage(false);
    setShowOrderPage(true);
  }

  // ---------------------------------------------------------------------------
  // Page flow: final order confirmation page
  // ---------------------------------------------------------------------------

  function goToConfirmationPage() {
    setShowCustomerDetailsPage(false);
    setShowConfirmationPage(true);
  }

  function goBackToCustomerDetails() {
    setShowConfirmationPage(false);
    setShowCustomerDetailsPage(true);
  }

  function submitOrder() {
    alert("Beställning skickad (placeholder)");
  }

  // ---------------------------------------------------------------------------
  // Cancellation flow
  // ---------------------------------------------------------------------------
  // If the cart contains items, ask the customer to confirm before clearing the
  // entire order.
  // ---------------------------------------------------------------------------

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
  // Helper: Swedish currency formatting
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

  if (showCustomerDetailsPage) {
    return (
      <CustomerDetailsForm
        customerDetails={customerDetails}
        onChange={setCustomerDetails}
        onBack={goBackToOrderPage}
        onContinue={goToConfirmationPage}
        onCancel={cancelOrder}
      />
    );
  }

  if (showConfirmationPage) {
    return (
      <OrderConfirmation
        cartItems={cartItems}
        customerDetails={customerDetails}
        formatPrice={formatPrice}
        onBack={goBackToCustomerDetails}
        onSubmit={submitOrder}
        onCancel={cancelOrder}
      />
    );
  }

  if (showOrderPage && selectedService) {
    return (
      <ServiceOrder
        cartItems={cartItems}
        onBack={goBackFromOrder}
        onContinue={goToCustomerDetails}
        onCancel={cancelOrder}
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
        useRotDeduction={useRotDeduction}
        onUseRotDeductionChange={setUseRotDeduction}
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
      navigationDescription={navigationMarkdownPath ? navigationDescription : ""}
    />
  );
}