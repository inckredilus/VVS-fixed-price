import type { Service } from "../../types/services";

type Props = {
  service: Service;
  quantity: number;
  onOk: () => void;
  formatPrice: (value: number) => string;
};

export default function ServiceOrder({
  service,
  quantity,
  onOk,
  formatPrice,
}: Props) {
  return (
    <main>
      <h1>Din beställning</h1>

      <p>
        <strong>Tjänst:</strong> {service.serviceName}
      </p>

      <p>
        <strong>Arbete:</strong> {service.work}
      </p>

      <p>
        <strong>Antal:</strong> {quantity}
      </p>

      <p>
        <strong>Ordinarie pris:</strong>{" "}
        {formatPrice(service.pricing.fullPrice * quantity)}
      </p>

      <p>
        <strong>ROT-pris:</strong>{" "}
        {formatPrice(service.pricing.discountPrice * quantity)}
      </p>

      <p>
        <strong>ServiceID:</strong> {service.serviceId}
      </p>

      <button onClick={onOk}>OK</button>
    </main>
  );
}