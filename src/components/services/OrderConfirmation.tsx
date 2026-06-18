import type {
  CartItem,
  CustomerDetails,
} from "../../types/services";

import { shouldShowEquipment } from "../../utils/orderHelpers";

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
  const totalPrice = cartItems.reduce((sum, item) => {
    const unitPrice = item.useRotDeduction
      ? item.service.pricing.discountPrice
      : item.service.pricing.fullPrice;

    return sum + unitPrice * item.quantity;
  }, 0);

  return (
    <main>
      <h1>Bekräfta beställning</h1>

      <h2>Kunduppgifter</h2>

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

      {customerDetails.comment && (
        <>
          <h3>Kommentar</h3>
          <p>{customerDetails.comment}</p>
        </>
      )}

      <h2>Beställning</h2>

      {cartItems.map((item, index) => {
        const unitPrice = item.useRotDeduction
          ? item.service.pricing.discountPrice
          : item.service.pricing.fullPrice;

        return (
          <div
            key={`${item.service.serviceId}-${index}`}
          >
            <p>
              {item.service.serviceName}
              {" - "}
              {item.service.work}
            </p>

            {shouldShowEquipment(item.service.equipment) && (
            <p>
                <strong>Utrustning:</strong> {item.service.equipment}
            </p>
            )}

            <p>
              Antal: {item.quantity}
            </p>

            <p>
              {item.useRotDeduction
                ? "Med ROT-avdrag"
                : "Utan ROT-avdrag"}
            </p>

            <p>
              Pris:{" "}
              {formatPrice(
                unitPrice * item.quantity
              )}
            </p>

            <hr />
          </div>
        );
      })}

      <h2>
        Totalt: {formatPrice(totalPrice)}
      </h2>

      <div>
        <button onClick={onBack}>
          Tillbaka
        </button>

        <button onClick={onSubmit}>
          Beställ
        </button>

        <button onClick={onCancel}>
          Avbryt
        </button>
      </div>
    </main>
  );
}