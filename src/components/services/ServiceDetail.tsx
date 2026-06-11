import type { Service } from "../../types/services";

type Props = {
  service: Service;
  descriptionText: string;
  imageSrc: string;
  quantity: number;
  onBack: () => void;
  onCancel: () => void;
  onAddToOrder: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  formatPrice: (value: number) => string;
};

export default function ServiceDetail({
  service,
  descriptionText,
  imageSrc,
  quantity,
  onBack,
  onCancel,
  onAddToOrder,
  onIncreaseQuantity,
  onDecreaseQuantity,
  formatPrice,
}: Props) {
  return (
    <main>
      <h1>{service.work}</h1>

      <p>
        {service.category} &gt; {service.serviceName} &gt; {service.work}
      </p>

      <img
        src={imageSrc}
        alt={`Bild för ${service.serviceName} - ${service.work}`}
        onError={(event) => {
          event.currentTarget.src = "/images/image_missing.jpeg";
        }}
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "auto",
          display: "block",
          marginBottom: "1rem",
        }}
      />

      <div>
        <p>
          <strong>Ordinarie pris:</strong>{" "}
          {formatPrice(service.pricing.fullPrice)}
        </p>
        <p>
          <strong>ROT-pris:</strong>{" "}
          {formatPrice(service.pricing.discountPrice)}
        </p>
      </div>

      <section>
        <h2>Beskrivning</h2>
        <div style={{ whiteSpace: "pre-wrap" }}>{descriptionText}</div>
      </section>

      <section>
        <h2>Antal</h2>

        <button onClick={onDecreaseQuantity} disabled={quantity === 0}>
          -
        </button>

        <span style={{ margin: "0 1rem" }}>{quantity}</span>

        <button onClick={onIncreaseQuantity}>+</button>
      </section>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={onBack}>Tillbaka</button>

        <button onClick={onAddToOrder} disabled={quantity === 0}>
          Lägg till
        </button>

        <button onClick={onCancel}>Avbryt</button>
      </div>

      <p>
        <strong>ServiceID:</strong> {service.serviceId}
      </p>
    </main>
  );
}