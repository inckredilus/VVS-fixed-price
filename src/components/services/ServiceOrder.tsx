import type { CartItem } from "../../types/services";

type Props = {
  cartItems: CartItem[];
  onOk: () => void;
  formatPrice: (value: number) => string;
};

export default function ServiceOrder({
  cartItems,
  onOk,
  formatPrice,
}: Props) {
  const totalFullPrice = cartItems.reduce(
    (sum, item) => sum + item.service.pricing.fullPrice * item.quantity,
    0
  );

  const totalDiscountPrice = cartItems.reduce(
    (sum, item) => sum + item.service.pricing.discountPrice * item.quantity,
    0
  );

  return (
    <main>
      <h1>Din beställning</h1>

      {cartItems.map((item, index) => (
        <section key={`${item.service.serviceId}-${index}`}>
          <h2>
            {item.service.serviceName} - {item.service.work}
          </h2>

          <p>
            <strong>Antal:</strong> {item.quantity}
          </p>

          <p>
            <strong>Ordinarie pris:</strong>{" "}
            {formatPrice(item.service.pricing.fullPrice * item.quantity)}
          </p>

          <p>
            <strong>ROT-pris:</strong>{" "}
            {formatPrice(item.service.pricing.discountPrice * item.quantity)}
          </p>

          <p>
            <strong>ServiceID:</strong> {item.service.serviceId}
          </p>

          <hr />
        </section>
      ))}

      <h2>Totalt</h2>

      <p>
        <strong>Ordinarie pris:</strong> {formatPrice(totalFullPrice)}
      </p>

      <p>
        <strong>ROT-pris:</strong> {formatPrice(totalDiscountPrice)}
      </p>

      <button onClick={onOk}>OK</button>
    </main>
  );
}