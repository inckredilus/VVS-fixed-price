import type { CartItem } from "../../types/services";

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
  const totalPrice = cartItems.reduce((sum, item) => {
    const unitPrice = item.useRotDeduction
      ? item.service.pricing.discountPrice
      : item.service.pricing.fullPrice;

    return sum + unitPrice * item.quantity;
  }, 0);

  return (
    <main>
      <h1>Din beställning</h1>

      {cartItems.map((item, index) => {
        const unitPrice = item.useRotDeduction
          ? item.service.pricing.discountPrice
          : item.service.pricing.fullPrice;

        const rowPrice = unitPrice * item.quantity;

        return (
          <section key={`${item.service.serviceId}-${index}`}>
            <h2>
              {item.service.serviceName} - {item.service.work}
            </h2>

            <p>
              <strong>Antal:</strong> {item.quantity}
            </p>

            <p>
              <strong>Prisval:</strong>{" "}
              {item.useRotDeduction ? "Med ROT-avdrag" : "Utan ROT-avdrag"}
            </p>

            <p>
              <strong>Pris:</strong> {formatPrice(rowPrice)}
            </p>

            <p>
              <strong>ServiceID:</strong> {item.service.serviceId}
            </p>

            <hr />
          </section>
        );
      })}

      <h2>Totalt</h2>

      <p>
        <strong>Pris:</strong> {formatPrice(totalPrice)}
      </p>

      <div>
        <button onClick={onBack}>Tillbaka</button>
        <button onClick={onContinue}>Fortsätt</button>
        <button onClick={onCancel}>Avbryt</button>
      </div>
      
    </main>
  );
}