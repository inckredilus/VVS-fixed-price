import type { CartItem } from "../../types/services";
import { shouldShowEquipment } from "../../utils/orderHelpers";

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
    <main>

      {/* -----------------------------------------------------------------------
          Page title
          ----------------------------------------------------------------------- */}

      <h1>Din beställning</h1>

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
          <section key={`${item.service.serviceId}-${index}`}>

            <h2>
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

            <hr />
          </section>
        );
      })}

      {/* -----------------------------------------------------------------------
          Order total
          ----------------------------------------------------------------------- */}

      <h2>Totalt</h2>

      <p>
        <strong>Pris:</strong> {formatPrice(totalPrice)}
      </p>

      {/* -----------------------------------------------------------------------
          Navigation buttons
          -----------------------------------------------------------------------
          Tillbaka : Return to ServiceDetail page.
          Fortsätt: Continue to Customer Details page.
          Avbryt  : Cancel the entire order process.
          ----------------------------------------------------------------------- */}

      <div>
        <button onClick={onBack}>
          Tillbaka
        </button>

        <button onClick={onContinue}>
          Fortsätt
        </button>

        <button onClick={onCancel}>
          Avbryt
        </button>
      </div>

    </main>
  );
}