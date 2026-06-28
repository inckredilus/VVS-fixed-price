import ReactMarkdown from "react-markdown";
import type { Service } from "../../types/services";
import "../../styles/components/services/service-detail.css";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
// ServiceDetail is a presentation component.
// It receives all data and event handlers from ServiceBrowser.tsx.
// This keeps the service/order state centralized in the parent controller.

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
  // ---------------------------------------------------------------------------
  // Page rendering
  // ---------------------------------------------------------------------------

return (
  <main className="service-detail">
    {/* -----------------------------------------------------------------------
        Service title and breadcrumb
        ----------------------------------------------------------------------- */}

    <section className="service-detail__header">
      <h1 className="service-detail__title">{service.work}</h1>

      <p className="service-detail__breadcrumb">
        {service.category} &gt; {service.serviceName} &gt; {service.work}
      </p>
    </section>

    {/* -----------------------------------------------------------------------
        Main service information
        ----------------------------------------------------------------------- */}

    <section className="service-detail__content">
      <img
        className="service-detail__image"
        src={imageSrc}
        alt={`Bild för ${service.serviceName} - ${service.work}`}
        onError={(event) => {
          event.currentTarget.src = "/images/image_missing.jpg";
        }}
      />

      <div className="service-detail__summary">
        <div className="service-detail__price-card">
          <p className="service-detail__price-row">
            <strong>Ordinarie pris:</strong>
            <span>{formatPrice(service.pricing.fullPrice)}</span>
          </p>

          <p className="service-detail__price-row service-detail__price-row--rot">
            <strong>ROT-pris:</strong>
            <span>{formatPrice(service.pricing.discountPrice)}</span>
          </p>
        </div>

        <section className="service-detail__description markdown-content">
          <h2>Beskrivning</h2>
          <ReactMarkdown>{descriptionText}</ReactMarkdown>
        </section>
      </div>
    </section>

    {/* -----------------------------------------------------------------------
        Quantity and ROT selection
        ----------------------------------------------------------------------- */}

    <section className="service-detail__order-panel">
      <h2 className="service-detail__section-title">Antal</h2>

        <div className="service-detail__quantity-row">
          <div className="service-detail__quantity">
            <button
              className="service-detail__quantity-button"
              onClick={onDecreaseQuantity}
              disabled={quantity === 0}
            >
              -
            </button>

            <span className="service-detail__quantity-value">{quantity}</span>

            <button
              className="service-detail__quantity-button"
              onClick={onIncreaseQuantity}
            >
              +
            </button>

            <button
              className="service-detail__clear-button"
              onClick={onClearQuantity}
              disabled={quantity === 0}
            >
              Rensa
            </button>
          </div>
          
          <label className="service-detail__rot-choice">
            <input
              type="checkbox"
              checked={useRotDeduction}
              onChange={(event) => onUseRotDeductionChange(event.target.checked)}
            />
            <span>Använd ROT-avdrag</span>
          </label>
        </div>
          
{/*      <label className="service-detail__rot-choice">
        <input
          type="checkbox"
          checked={useRotDeduction}
          onChange={(event) => onUseRotDeductionChange(event.target.checked)}
        />
        <span>Använd ROT-avdrag</span>
      </label> */}

    </section>

    {/* -----------------------------------------------------------------------
        Action buttons
        ----------------------------------------------------------------------- */}

    <section className="service-detail__actions">
      <button
        className="service-detail__button service-detail__button--secondary"
        onClick={onBack}
      >
        Tillbaka
      </button>

      <button
        className="service-detail__button service-detail__button--primary"
        onClick={onAddToOrder}
        disabled={quantity === 0}
      >
        Lägg till
      </button>

      <button
        className="service-detail__button service-detail__button--primary"
        onClick={onGoToOrderPage}
        disabled={cartItemCount === 0}
      >
        Gå till beställning ({cartItemCount})
      </button>

      <button
        className="service-detail__button service-detail__button--ghost"
        onClick={onCancel}
      >
        Avbryt
      </button>
    </section>

    <p className="service-detail__service-id">
      <strong>ServiceID:</strong> {service.serviceId}
    </p>
  </main>
);
}