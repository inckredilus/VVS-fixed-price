import type { CartItem } from "../../types/services";
import { shouldShowEquipment } from "../../utils/orderHelpers";
import "../../styles/components/services/service-order.css";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
// ServiceOrder is a presentation component.
//
// It displays the current shopping cart and order totals.
// All cart management and navigation logic is handled by ServiceBrowser.tsx.

type Props = {
  cartItems: CartItem[];

  onBack: () => void;
  onContinue: () => void;
  onCancel: () => void;

  formatPrice: (value: number) => string;
};

export default function ServiceOrder({
  cartItems,
  onBack,
  onContinue,
  onCancel,
  formatPrice,
}: Props) {

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------
  // Calculate the total order price based on the customer's chosen
  // ROT option for each individual cart item.
  // ---------------------------------------------------------------------------

  const totalPrice = cartItems.reduce((sum, item) => {
    const unitPrice = item.useRotDeduction
      ? item.service.pricing.discountPrice
      : item.service.pricing.fullPrice;

    return sum + unitPrice * item.quantity;
  }, 0);

  // ---------------------------------------------------------------------------
  // Page rendering
  // ---------------------------------------------------------------------------

  return (
    <main className="service-order">

      {/* -----------------------------------------------------------------------
          Page title
          ----------------------------------------------------------------------- */}

      <h1 className="service-order__title">
        Din beställning
      </h1>

      {/* -----------------------------------------------------------------------
          Ordered services
          -----------------------------------------------------------------------
          Each cart row contains:
          - Service
          - Optional equipment choice
          - Quantity
          - ROT choice
          - Selected price
          ----------------------------------------------------------------------- */}

      {cartItems.map((item, index) => {

        // ---------------------------------------------------------------------
        // Calculate price for current cart row
        // ---------------------------------------------------------------------

        const unitPrice = item.useRotDeduction
          ? item.service.pricing.discountPrice
          : item.service.pricing.fullPrice;

        const rowPrice = unitPrice * item.quantity;

        return (
          <section
            className="service-order__item"
            key={`${item.service.serviceId}-${index}`}
          >
            <h2 className="service-order__item-title">
              {item.service.serviceName} - {item.service.work}
            </h2>

            {/* ---------------------------------------------------------------
                Only display equipment if the customer selected a specific
                product. Generic values such as "ospec" are hidden.
                --------------------------------------------------------------- */}

            {shouldShowEquipment(item.service.equipment) && (
              <p>
                <strong>Utrustning:</strong>{" "}
                {item.service.equipment}
              </p>
            )}

            <p>
              <strong>Antal:</strong> {item.quantity}
            </p>

            <p>
              <strong>Prisval:</strong>{" "}
              {item.useRotDeduction
                ? "Med ROT-avdrag"
                : "Utan ROT-avdrag"}
            </p>

            <p>
              <strong>Pris:</strong> {formatPrice(rowPrice)}
            </p>

            {/* ---------------------------------------------------------------
                Internal service reference
                Useful during testing and later for order handling.
                --------------------------------------------------------------- */}

            <p>
              <strong>ServiceID:</strong>{" "}
              {item.service.serviceId}
            </p>

            <hr className="service-order__divider" />
          </section>
        );
      })}

      {/* -----------------------------------------------------------------------
          Order total
          ----------------------------------------------------------------------- */}

      <h2 className="service-order__total-title">
        Totalt
      </h2>

      <p className="service-order__total-price">
        <strong>Pris:</strong> {formatPrice(totalPrice)}
      </p>

      {/* -----------------------------------------------------------------------
          Navigation buttons
          -----------------------------------------------------------------------
          Tillbaka : Return to ServiceDetail page.
          Fortsätt: Continue to Customer Details page.
          Avbryt  : Cancel the entire order process.
          ----------------------------------------------------------------------- */}

      <div className="service-order__actions">
        <button 
          className="service-order__button service-order__button--secondary"
          onClick={onBack}
        >
          Tillbaka
        </button>

        <button 
          className="service-order__button service-order__button--primary"
          onClick={onContinue}
        >
          Fortsätt
        </button>

        <button 
          className="service-order__button service-order__button--ghost"
          onClick={onCancel}
        >
          Avbryt
        </button>
      </div>

    </main>
  );
}