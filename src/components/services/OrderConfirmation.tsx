import type {
  CartItem,
  CustomerDetails,
} from "../../types/services";

import "../../styles/buttons.css";
import { shouldShowEquipment } from "../../utils/orderHelpers";
import "../../styles/components/services/order-confirmation.css";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
// OrderConfirmation is a presentation component.
//
// It displays the complete order before final submission:
// - Customer information
// - Ordered services
// - Total price
//
// All navigation and submission logic is handled by ServiceBrowser.tsx.

type Props = {
  cartItems: CartItem[];
  customerDetails: CustomerDetails;

  formatPrice: (value: number) => string;

  onBack: () => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function OrderConfirmation({
  cartItems,
  customerDetails,
  formatPrice,
  onBack,
  onSubmit,
  onCancel,
}: Props) {

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------
  // Calculate the final order price using the customer's selected ROT option
  // for each cart item.
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
    <main className="order-confirmation">

      {/* -----------------------------------------------------------------------
          Page title
          ----------------------------------------------------------------------- */}

      <h1 className="order-confirmation__title">Bekräfta beställning</h1>

      {/* -----------------------------------------------------------------------
          Customer details
          -----------------------------------------------------------------------
          Display the customer information exactly as entered in the previous
          step before the order is finally submitted.
          ----------------------------------------------------------------------- */}

      <section className="order-confirmation__card">
        <h2 className="order-confirmation__section-title">
          Kunduppgifter
        </h2>

        <p>
          {customerDetails.firstName}{" "}
          {customerDetails.lastName}
        </p>

        <p>{customerDetails.address}</p>

        <p>
          {customerDetails.postalCode}{" "}
          {customerDetails.city}
        </p>

        <p>{customerDetails.phone}</p>

        <p>{customerDetails.email}</p>

        {/* -----------------------------------------------------------------------
            Optional customer comment
            ----------------------------------------------------------------------- */}

        {customerDetails.comment && (
          <>
            <h3>Kommentar</h3>
            <p>{customerDetails.comment}</p>
          </>
        )}

      </section>

      {/* -----------------------------------------------------------------------
          Ordered services
          -----------------------------------------------------------------------
          Each cart row displays:
          - Service
          - Optional equipment selection
          - Quantity
          - ROT selection
          - Price for that order row
          ----------------------------------------------------------------------- */}

      <section className="order-confirmation__card">
        <h2 className="order-confirmation__section-title">
          Beställning
        </h2>

        {cartItems.map((item, index) => {

          // ---------------------------------------------------------------------
          // Calculate price for current cart row
          // ---------------------------------------------------------------------

          const unitPrice = item.useRotDeduction
            ? item.service.pricing.discountPrice
            : item.service.pricing.fullPrice;

          const rowPrice = unitPrice * item.quantity;

          return (
            <div className="order-confirmation__item"
              key={`${item.service.serviceId}-${index}`}>
            
              <p>
                {item.service.serviceName}
                {" - "}
                {item.service.work}
              </p>

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
                <strong>Pris:</strong>{" "}
                {formatPrice(rowPrice)}
              </p>

              <hr className="order-confirmation__divider" />
            </div>
          );
        })}

      </section>

      {/* -----------------------------------------------------------------------
          Order total
          ----------------------------------------------------------------------- */}

      <section className="order-confirmation__total">
        <h2>
          Totalt: {formatPrice(totalPrice)}
        </h2>
      </section>

      {/* -----------------------------------------------------------------------
          Navigation buttons
          -----------------------------------------------------------------------
          Tillbaka : Return to Customer Details page.
          Beställ : Final order submission (currently placeholder).
          Avbryt  : Cancel the entire order flow.
          ----------------------------------------------------------------------- */}

      <div className="order-confirmation__actions">
        <button
          className="button button--secondary"
          onClick={onBack}
        >
          Tillbaka
        </button>

       <button
          className="button button--primary"
          onClick={onSubmit}
        >
          Beställ
        </button>

        <button
          className="button button--ghost"
          onClick={onCancel}
        >
          Avbryt
        </button>
      </div>

    </main>
  );
}