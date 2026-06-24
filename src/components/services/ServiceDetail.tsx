import type { Service } from "../../types/services";
import ReactMarkdown from "react-markdown";

type Props = {
  service: Service;
  descriptionText: string;
  imageSrc: string;
  quantity: number;
  cartItemCount: number;
  onBack: () => void;
  onCancel: () => void;
  onAddToOrder: () => void;
  onGoToOrderPage: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onClearQuantity: () => void;
  useRotDeduction: boolean;
  onUseRotDeductionChange: (value: boolean) => void;
  formatPrice: (value: number) => string;
};

export default function ServiceDetail({
  service,
  descriptionText,
  imageSrc,
  quantity,
  cartItemCount,
  onBack,
  onCancel,
  onAddToOrder,
  onGoToOrderPage,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onClearQuantity,
  useRotDeduction,
  onUseRotDeductionChange,
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
          event.currentTarget.src = "/images/image_missing.jpg";
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
         <ReactMarkdown>{descriptionText}</ReactMarkdown>
      </section>

      <section>
        <h2>Antal</h2>

        <button onClick={onDecreaseQuantity} disabled={quantity === 0}>
          -
        </button>

        <span style={{ margin: "0 1rem" }}>{quantity}</span>

        <button onClick={onIncreaseQuantity}>
            +
        </button>

        <button onClick={onClearQuantity} disabled={quantity === 0}>
            Rensa
        </button>

        <label style={{ display: "block", marginTop: "1rem" }}>
          <input
            type="checkbox"
            checked={useRotDeduction}
            onChange={(event) => onUseRotDeductionChange(event.target.checked)}
          />{" "}
          Jag vill använda ROT-avdrag
        </label>

      </section>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={onBack}>Tillbaka</button>

        <button onClick={onAddToOrder} disabled={quantity === 0}>
          Lägg till
        </button>

        <button onClick={onGoToOrderPage} disabled={cartItemCount === 0}>
          Gå till beställning ({cartItemCount})
        </button>

        <button onClick={onCancel}>Avbryt</button>
      </div>

      <p>
        <strong>ServiceID:</strong> {service.serviceId}
      </p>
    </main>
  );
}